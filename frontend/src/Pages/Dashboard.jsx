import { Appbar } from "../components/AppBar"
import { BalanceBar } from "../components/BalanceBar"
import { Users } from "../components/Users"

const Dashboard = () => {
  return (
    <div>
      <Appbar />
      <BalanceBar />
      <Users/>
    </div>
  )
}

export default Dashboard