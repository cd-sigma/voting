import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter,
} from "react-router-dom"

import Landing from "./pages/Landing"
import Navbar from "./components/Navbar"
import GasTracker from "./pages/GasTracker"
import Proposals from "./pages/Proposals"
import DelegateVote from "./pages/DelegateVote"
import CreateProposal from "./pages/CreateProposal"
import Proposal from "./pages/Proposal"

function App() {
  return (
    <Router>
      <Navbar />
      <div className="w-full h-screen">
        <Switch>
          <Route exact path="/" component={withRouter(Landing)} />
          <Route exact path="/gas-tracker" component={withRouter(GasTracker)} />
          <Route exact path="/proposals" component={withRouter(Proposals)} />
          <Route
            exact
            path="/delegate-vote"
            component={withRouter(DelegateVote)}
          />
          <Route
            exact
            path="/create-proposal"
            component={withRouter(CreateProposal)}
          />
          <Route
            exact
            path="/proposal/:proposalId"
            component={withRouter(Proposal)}
          />
        </Switch>
      </div>
    </Router>
  )
}

export default App
