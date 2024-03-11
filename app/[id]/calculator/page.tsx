'use client'
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CardContent, Card, CardTitle, CardHeader, CardFooter } from "@/components/ui/card"
import {app} from '@/components/config/firebaseConfig'
import { getDatabase, onValue, ref, remove, set } from "firebase/database";
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function Home({
    params,
} : {
    params: {
        id: string
    }
}


) {
  const database = getDatabase(app);
  const router = useRouter()


  const [orders, setOrders] = useState([]);;
  const [menus, setMenus] = useState([]);
  const [users, setUsers] = useState([]); 
  const [joinppl, setjoinppl] = useState([]);
  const [filteredMenus, setFilteredMenus] = useState([]);
  const [filteredjoinppl, setFilteredjoinppl] = useState([]);


  const [totalOrderValue, setTotalOrderValue] = useState(0);
  const [totalPaymentValue, setTotalPaymentValue] = useState(0);  
  const [payersAmount, setPayersAmount] = useState(0);
  const [totalPayers, setTotalPayers] = useState(0);
  const [totalNonPayers, setTotalNonPayers] = useState(0);
  const [totalPayersAmount, setTotalPayersAmount] = useState(0);
  const [totalNonPayersAmount, setTotalNonPayersAmount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(2000);
  const [newPayment, setNewPayment] = useState(0);
  const [newNonPayment, setNewNonPayment] = useState(0);


  const paymentRef = ref(database, 'Events/' + params.id + '/payment');
  const orderRef = ref(database, 'Events/' + params.id + '/orders');
  const menuRef = ref(database, 'Events/' + params.id + '/menus');
  const joinpplsRef = ref(database, 'Events/' + params.id + '/joinppl');
  const gatheredRef = ref(database, 'Events/' + params.id + '/gathered');
  const usersRef = ref(database, 'users');



  useEffect(() => {
    //orders
    onValue(orderRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const dataArray = Object.entries(data || {}).map(([key, value]) => ({
          menu: key,
          amount: value
        }));

        setOrders(dataArray);
      }

      //joinppl
      onValue(joinpplsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const dataArray = Object.entries(data || {}).map(([key, value]) => ({
            name: key,
            payment: value
          }));
          console.log(dataArray)
          setjoinppl(dataArray)
          setFilteredjoinppl(dataArray)
        }
      })
      //users
      onValue(usersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const dataArray = Object.entries(data || {}).map(([key, value]) => ({
            name: key,
            payment: value
          }));
          setUsers(dataArray)
        }
      })

      //gathered amount of money
      onValue(gatheredRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const dataArray = Object.entries(data || {}).map(([key, value]) => ({
            obj: key,
            amount: value
          }));
          setTotalPaymentValue(dataArray.find(obj => obj.obj === 'money').amount)
    }})

    }, [])
    
    //Difference between payers and nonpayers
    onValue(paymentRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const dataArray = Object.entries(data || {}).map(([key, value]) => ({
          payers: key,
          payment: value
        }));
        setPayersAmount(dataArray)
      }
      
    })

    //Menus
    onValue(menuRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const dataArray = Object.entries(data || {}).map(([key, value]) => ({
          menu: key,
          price: value
        }));
        setMenus(dataArray)
        setFilteredMenus(dataArray)
      }
    
    })

  }, [])

  //Total order value
  useEffect(() => {
    const total = orders.reduce((total, order) => {
      const menu = menus.find(menu => menu.menu === order.menu);
      if (menu) {
        const itemTotal = menu.price * order.amount;
        return total + itemTotal;
      }
      return total;
    }, 0);
    setTotalOrderValue(total);
    
  }, [orders, menus])

  useEffect(() => {
    // Fetch and set the `joinppl` and `users` data from Firebase in previous useEffects
    
    // Filter for users who have paid
    const paidUsers = users.filter(user => user.payment === true);
    
    // Filter for joined people, checking against paid users to determine if they've paid
    const joinedAndPaid = joinppl.filter(jp => paidUsers.some(pu => pu.name === jp.name));
    const totalPayers = joinedAndPaid.length;
    
    // Assuming every entry in `joinppl` is a participant, total non-payers can be calculated
    const totalNonPayers = joinppl.length - totalPayers;

    // Update state
    setTotalPayers(totalPayers);
    setTotalNonPayers(totalNonPayers);
    
  }, [joinppl, users]); 
  // Ensure this runs when `joinppl` or `users` updates

  useEffect(() => {
    if (totalPayers > 0 && totalNonPayers > 0) {
      // Calculate the base share for all participants before any discounts
      const equalShare = totalOrderValue / (totalPayers + totalNonPayers);
  
      // Calculate the adjusted share for payers, considering the discount
      const payerShareRaw = equalShare - discountAmount;
      // Round the payer's share up to the nearest thousand
      const payerShare = Math.ceil(payerShareRaw / 1000) * 1000;
  
      // Calculate the total amount that needs to be covered by non-payers,
      // which includes the discount given to payers
      const totalNeededFromNonPayers = totalOrderValue - (payerShare * totalPayers);
      // Calculate the raw share for each non-payer
      const nonPayerShareRaw = totalNeededFromNonPayers / totalNonPayers;
      // Round the non-payer's share up to the nearest thousand
      const nonPayerShare = Math.ceil(nonPayerShareRaw / 1000) * 1000;
  
      setTotalPayersAmount(payerShare);
      setTotalNonPayersAmount(nonPayerShare);
    }
  }, [totalOrderValue, totalPayers, totalNonPayers, discountAmount]);
   // Include discountAmount in the dependency array
  // Recalculates when any of these dependencies change.

  




  const handleMenuSearch = (searchTerm) => {
    const filtered = menus.filter(menu => menu.menu.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredMenus(filtered);
  }

  const handlejoinpplearch = (searchTerm) => {
    const filtered = joinppl.filter(student => student.name.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredjoinppl(filtered);
  }
  
  const handleAddItem = (menu) => {
    const currentAmount = orders.find(order => order.menu === menu)?.amount || 0; // Retrieve current amount or default to 0 if not found
    set(ref(database, `Events/testEvent/orders/${menu}`), currentAmount + 1)
      .then(() => console.log("Item added successfully")) // Optional: Log success message
      .catch((error) => console.error("Error adding item:", error)); // Optional: Log error if any
  }
  
  const handleRemoveItem = (menu) => {
    const currentAmount = orders.find(order => order.menu === menu)?.amount || 0; // Retrieve current amount or default to 0 if not found
    if (currentAmount > 0) {
      set(ref(database, `Events/testEvent/orders/${menu}`), currentAmount - 1)
        .then(() => console.log("Item removed successfully")) // Optional: Log success message
        .catch((error) => console.error("Error removing item:", error)); 
        if(currentAmount -1 === 0){
          remove(ref(database, `Events/testEvent/orders/${menu}`))
        }
    }
    else{
      remove(ref(database, `Events/testEvent/orders/${menu}`))
    }
  }

  const handlePayment = (pay) => {
    if (pay) {
      const payer = payersAmount.find(payment => payment.payers === 'payers');
      if (payer) {
        set(ref(database, `Events/testEvent/gathered/money`), totalPaymentValue + payer.payment)
        setTotalPaymentValue(totalPaymentValue + payer.payment);
      }
    } else {
      const nonPayer = payersAmount.find(payment => payment.payers === "nonpayers");
      if (nonPayer) {
        set(ref(database, `Events/testEvent/gathered/money`), totalPaymentValue + nonPayer.payment)
        setTotalPaymentValue(totalPaymentValue + nonPayer.payment);
      }
    }
  };

  const handleDeletePayment = (pay) => {
    if (pay) {
      const payer = payersAmount.find(payment => payment.payers === 'payers');
      if (payer) {
        setTotalPaymentValue(totalPaymentValue - payer.payment);
        set(ref(database, `Events/testEvent/gathered/money`), totalPaymentValue - payer.payment)
      }
    } else {
      const nonPayer = payersAmount.find(payment => payment.payers === "nonpayers");
      if (nonPayer) {
        set(ref(database, `Events/testEvent/gathered/money`), totalPaymentValue - nonPayer.payment)
      }
    }
  }

  const handleJoinPPls = (name) => {
    set(ref(database, `Events/testEvent/joinppl/${name}`), true)
      .then(() => console.log("Item added successfully")) // Optional: Log success message
      .catch((error) => console.error("Error adding item:", error)); // Optional: Log error if any
  }

  const handleAddJoinPpls = (name) => {
    set(ref(database, `Events/testEvent/joinppl/${name}`), false)
      .then(() => console.log("Item added successfully")) // Optional: Log success message
      .catch((error) => console.error("Error adding item:", error)); // Optional: Log error if any
  }

  const handleRecalculate = () => {
    const newPayment = totalPayersAmount; // Amount each payer owes
    const newNonPayment = totalNonPayersAmount;
    set(ref(database, `Events/` + params.id + "/payment"), {
        payers: newPayment,
        nonpayers: newNonPayment
    })
  }

  return (
    <div key="1" className="grid min-h-screen w-full overflow-hidden lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link className="flex items-center gap-2 font-semibold" href="#">
              <Package2Icon className="h-6 w-6" />
              <span className="">Calculator - {params.id}</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <form>
                <div className="relative">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <Input
                    className="w-full bg-white shadow-none appearance-none pl-8 mx-auto dark:bg-gray-950"
                    placeholder="Search products..."
                    type="search"
                    onChange={(e) => handlejoinpplearch(e.target.value)}
                  />
                </div>
              </form>
            <nav className="grid items-start px-4 text-sm font-medium mt-4">
              
              <h2 className="font-semibold text-lg">Joined students</h2>
              <div className="grid grid-cols-1 gap-4 mt-4">
                {filteredjoinppl.map((student, index) => {
                  return(
                    <UserBlock key={index} name={student.name} joinpayment={joinppl.find(ppls => ppls.name == student.name)?.payment} payment={users.find(user => user.name === student.name)?.payment} addpayment={handlePayment} deleteUser={handleJoinPPls} deletepayement={handleDeletePayment} addUser={handleAddJoinPpls}/>
                  )
                })
                }
              </div>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
          <Link className="lg:hidden" href="#">
            <Package2Icon className="h-6 w-6" />
            <span className="sr-only">Home</span>
          </Link>
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  className="w-full bg-white shadow-none appearance-none pl-8 mx-auto dark:bg-gray-950"
                  placeholder="Search joinppl..."
                  type="search"
                  onChange={(e) => handleMenuSearch(e.target.value)}
                />

              </div>
            </form>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <div className="flex items-center gap-4">
            <h1 className="font-semibold text-lg md:text-xl">Shopping Cart</h1>
          </div>
          <div className="flex flex-col md:grid md:grid-cols-6 gap-6">
            <div className="md:col-span-4 lg:col-span-3 xl:col-span-4 flex flex-col gap-6">
            {filteredMenus.map((menu, index) => (
              <MenuBlock key={index} name={menu.menu} price={"$" + menu.price} onAddItem={handleAddItem} onDeleteItem={handleRemoveItem}/>
            ))}
            </div>
            <div className="md:col-span-2 lg:col-span-3 xl:col-span-2 flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div>Payed</div>
                  <Input id="payedPplAmount" placeholder="Enter payed ppls amount" type="number"  value={totalPayersAmount.toFixed(2)}></Input>
                  <div>Not Payed</div>
                  <Input id="notpayedPplAmount" placeholder="Enter not payed ppls amount" type="number" value={totalNonPayersAmount.toFixed(2)}></Input>
                  <div>Discount Amount</div>
                  <Input id="notpayedPplAmount" value={discountAmount} onChange={(e) => setDiscountAmount(Number(e.target.value))} placeholder="Discount Amount" ></Input>
                </CardContent>
                <CardFooter className="flex items-center gap-2">
                  <Button size="sm" onClick={handleRecalculate}>Recalulate</Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Payment</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <ul className="list-disc pl-5 mb-4">
                    {
                      orders.map((order, index) => (
                        <PaymentBlock key={index} name={order.menu} price={menus.find(menu => menu.menu === order.menu)?.price} amount={order.amount} deleteItem={handleRemoveItem}/>
                      ))
                    }
                  </ul>
                  <div className="flex items-center">
                    <div>Total</div>
                    <div className="ml-auto">{totalOrderValue}</div>
                  </div>
                  <div className="flex items-center">
                    <div>Gathered</div>
                    <div className="ml-auto">{totalPaymentValue}</div>
                  </div>
                  <div className="flex items-center">
                    <div>{totalPaymentValue >= totalOrderValue  ? "All Done!" : "Not Yet..."}</div>
                  </div>
                </CardContent>
                <CardFooter className="flex items-center gap-2">
                  <Button size="sm">All Done</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}


function Package2Icon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
      <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
      <path d="M12 3v6" />
    </svg>
  )
}


function SearchIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}


function UserBlock({ name, payment, joinpayment, addpayment, deletepayement, deleteUser, addUser }) {

  const handleDelete = () => {
    addpayment(payment);
    deleteUser(name);
  };

  const handleAdd = () => {
    deletepayement(payment);
    addUser(name);
  }


  return (
    <Card className="text-center">
      <CardContent>
        <h3 className="font-medium">{name}</h3>
        <p className="text-gray-500 dark:text-gray-400">학생회비 제출여부: {payment ? "제출함" : "제출안함"}</p>
        {!joinpayment ? (
          <Button size="sm" onClick={handleDelete}>Payed</Button>
        ) : (
          <Button size="sm" onClick={handleAdd}>Undo</Button>
        )}
      </CardContent>
    </Card>
  );
}

function MenuBlock({name, price, onAddItem, onDeleteItem}){
  const handleAddItem = () => {
    onAddItem(name);
  }

  const handleDeleteItem = () => {
    onDeleteItem(name);
  }

  return(
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <p className="text-gray-500 dark:text-gray-400">{price}</p>
        <Button className="absolute right-24 top-0" size="sm" onClick={handleAddItem}>
        add
        </Button>
        <Button className="absolute right-4 top-0" size="sm" onClick={handleDeleteItem}>
          remove
        </Button>
      </CardContent>
    </Card>
  )
}

function PaymentBlock({name, price, amount, deleteItem}){
  const handleDeleteItem = () => {
    deleteItem(name);
  }

  return(
    <li className="flex justify-between items-center mb-2">
      {name} : ₩{price} X {amount} = ₩{price*amount}
      <Button className="ml-4" size="sm" onClick={handleDeleteItem}>
        Remove
      </Button>
    </li>
  )
}