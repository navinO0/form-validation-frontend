import {Route, Switch, BrowserRouter} from 'react-router-dom'
import './App.css'
import FormComponent from './components/FormComponent'
import DataTablesComponent from './components/DataTableComponent'
import HomeComponent from './components/HomeComponent'

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={HomeComponent} />
      <Route exact path="/register" component={FormComponent} />
      <Route exact path="/users" component={DataTablesComponent} />
    </Switch>
  </BrowserRouter>
)

export default App
