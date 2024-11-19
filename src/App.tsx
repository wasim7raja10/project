import InputContainer from "./components/InputContainer"
import { TabsContainer } from "./components/TabsContainer"

function App() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8">Invoice Management System</h1>
        <InputContainer />
        <TabsContainer />
      </div>
    </div>
  )
}

export default App
