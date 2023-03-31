import styles from "./RegistrationForm.module.css";
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from "react";


// I am not sure if the requirements are asking for fields full_name, contact_number, email, day, 
// month, year password and confirm_password; or the three fields shown in Figma (full_name , email 
// and password). I asked the HR manager (Joyce Tango) for clarification, but this was not provided. 
// I have used the latter interpretation.
export default function RegistrationForm() {
  // state of form errors
  const [error, setError] = useState({
    name: {
      error: false,
      helperText: ''
    },
    email: {
      error: false,
      helperText: ''
    },
    password: {
      error: false,
      helperText: ''
    }
  });

  // I'm not sure if the requirements are asking alert messages to be set to the results of the API 
  // response, Figma seems to have preset text, I went with preset approach, but left text as part 
  // of state rather than hard-coded so that it can be changed easily
  const successAlert = 'User account successfully created.';
  const errorAlert = 'There was an error creating the account.';
  // state of the alert message
  const [alert, setAlert] = useState({
    show: false,
    error: false,
    text: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextError = {
      name: { error: false, helperText: '' },
      email: { error: false, helperText: '' },
      password: { error: false, helperText: '' }
    };

    // I used a somewhat novel approach to form validation. I use the native web elements to do 
    // validation, one advantage of this approach is that it can easily be changed to use native browser 
    // input validation. I am not yet an expert at React, I am sure this is not the idiomatic approach, I 
    // hope to learn more about React in the future. If you hire me I promise to become an expert at React 
    // before I start the job.
    const name = event.currentTarget.querySelector('#name');
    const email = event.currentTarget.querySelector('#email');
    const password = event.currentTarget.querySelector('#password');

    // for more about validity attribute seen below ,see 
    // https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation#validating_forms_using_javascript

    // validate name
    if (name.validity.valueMissing) {
      nextError.name.error = true;
      nextError.name.helperText = 'Name must be provided';
    }
    if (name.validity.patternMismatch) {
      nextError.name.error = true;
      nextError.name.helperText = 'Name must not contain symbols';
    }
    if (name.value.trim() !== name.value) {
      nextError.name.error = true;
      nextError.name.helperText = 'Name must not have spaces around';
    }

    // validate email
    if (email.validity.valueMissing || email.validity.typeMismatch) {
      nextError.email.error = true;
      nextError.email.helperText = 'Sorry, this email address is not valid. Please try again.';
    }

    // validate password
    if (password.validity.valueMissing || password.validity.tooShort) {
      nextError.password.error = true;
      nextError.password.helperText = 'Password must be atleast 8 characters in length';
    }
    if (password.validity.patternMismatch) {
      nextError.password.error = true;
      nextError.password.helperText = 'Password must contain only letters and/or numbers';
    }

    setError(nextError);
    // early out in case of error
    if (nextError.name.error || nextError.email.error || nextError.password.error) {
      return;
    }
    setIsSubmitting(true);
    const response = await fetch(
      "https://fullstack-test-navy.vercel.app/api/users/create",
      new FormData(event.currentTarget)
    );
    setIsSubmitting(false);
    if (response.status === 200) {
      setAlert({
        show: true,
        error: false,
        text: successAlert
      });
    } else {
      setAlert({
        show: true,
        error: true,
        text: errorAlert
      });
    }
    // remove alert after 3 seconds
    setTimeout(() => {
      setAlert({
        show: false,
        error: false,
        text: ''
      });
    }, 3000);
  };

  const theme = createTheme({
    components: {
      MuiFormLabel: {
        styleOverrides: {
          asterisk: {
            color: "#db3131",
            "&$error": {
              color: "#db3131",
            },
          },
        },
      },
    },
  });

  return (
    <>
      {/* Show alert conditionally, set style depending on alert.error boolean */
        alert.show &&
        <div className={`${styles.alert} ${alert.error ? styles.alertError : styles.alertSuccess}`}>{alert.text}</div>
      }
      <div className={styles.container}>
        <h1 className={styles.header}>Create User Account</h1>
        <ThemeProvider theme={theme}>
          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.shadowBox}>
              <label htmlFor="name" className={styles.label}>Full Name</label>
              <TextField
                autoComplete="name"
                name="full_name"
                required
                fullWidth
                id="name"
                label="Full Name"
                error={error.name.error}
                helperText={error.name.helperText}
                inputProps={{ pattern: '^[A-Za-z0-9\\s]+$' }}
              />
              <label htmlFor="email" className={styles.label}>Email Address</label>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                error={error.email.error}
                helperText={error.email.helperText}
                type='email'
              />
              <label htmlFor="password" className={styles.label}>Password</label>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                error={error.password.error}
                helperText={error.password.helperText}
                inputProps={{ minLength: '8', pattern: '^[A-Za-z0-9]+$' }}
              />
            </div>
            <div className={styles.buttonContainer}>
              <button type="button">Cancel</button>
              <button 
                className="accent-button" 
                type="submit"
                disabled={isSubmitting}
              >
                Submit
              </button>
            </div>
          </form>
        </ThemeProvider>
      </div>
    </>
  );
} 