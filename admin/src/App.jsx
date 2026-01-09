import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

function App() {
  return (
    <div>
      <h1>HOME PAGE</h1>

      <header>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
    </div>
  )
}

export default App
