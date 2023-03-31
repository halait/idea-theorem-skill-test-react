import logo from './assets/logo.png';
import './App.css';
import RegistrationForm from './registration_form/RegistrationForm';

export default function App() {
  return (<>
    <header id="app-header">
      <div id="app-header-container">
        <img id="app-header-logo" src={logo} alt="logo" />
      </div>
    </header>
    <RegistrationForm />
  </>);
}
