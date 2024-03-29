/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/RaOKL0xapKJ
 */
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CardContent, Card, CardTitle, CardHeader, CardFooter } from "@/components/ui/card"

export function Component() {
  return (
    <div key="1" className="grid min-h-screen w-full overflow-hidden lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link className="flex items-center gap-2 font-semibold" href="#">
              <Package2Icon className="h-6 w-6" />
              <span className="">Acme Retail Store</span>
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
                />
              </div>
            </form>
            <nav className="grid items-start px-4 text-sm font-medium mt-4">
              <h2 className="font-semibold text-lg">Product Catalog</h2>
              <div className="grid grid-cols-1 gap-4 mt-4">
                <Card className="text-center">
                  <CardContent>
                    <h3 className="font-medium">Product 1</h3>
                    <p className="text-gray-500 dark:text-gray-400">$19.99</p>
                    <Button className="mt-2" size="sm">
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent>
                    <h3 className="font-medium">Product 2</h3>
                    <p className="text-gray-500 dark:text-gray-400">$29.99</p>
                    <Button className="mt-2" size="sm">
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <img
                    alt="Product image"
                    className="aspect-square rounded-md object-cover"
                    height="64"
                    src="/placeholder.svg"
                    width="64"
                  />
                  <CardContent>
                    <h3 className="font-medium">Product 3</h3>
                    <p className="text-gray-500 dark:text-gray-400">$39.99</p>
                    <Button className="mt-2" size="sm">
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
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
                  className="w-full bg-white shadow-none appearance-none pl-8 md:w-2/3 lg:w-1/3 dark:bg-gray-950"
                  placeholder="Search products..."
                  type="search"
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
              <Card>
                <CardHeader>
                  <CardTitle>Product 1</CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <p className="text-gray-500 dark:text-gray-400">$19.99</p>
                  <Button className="absolute right-4 top-0" size="sm">
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Product 2</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400">$29.99</p>
                </CardContent>
              </Card>
            </div>
            <div className="md:col-span-2 lg:col-span-3 xl:col-span-2 flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <ul className="list-disc pl-5 mb-4">
                    <li className="flex justify-between items-center mb-2">
                      Product 1 - $19.99
                      <Button className="ml-4" size="sm">
                        Remove
                      </Button>
                    </li>
                    <li className="flex justify-between items-center">
                      Product 2 - $29.99
                      <Button className="ml-4" size="sm">
                        Remove
                      </Button>
                    </li>
                  </ul>
                  <div className="flex items-center">
                    <div>Total</div>
                    <div className="ml-auto">$49.98</div>
                  </div>
                </CardContent>
                <CardFooter className="flex items-center gap-2">
                  <Button size="sm">Checkout</Button>
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
