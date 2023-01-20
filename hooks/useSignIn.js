import { useRouter } from 'next/router';
import { useState, useRef } from 'react';

function useSignIn() {
  const [boxError, setBoxError] = useState({
    visible: false,
    message: '',
  });
  const [errorInputs, setErrorInputs] = useState({
    emailInput: false,
    pwdInput: false,
  });
  const refInputs = useRef([]);
  const router = useRouter();

  const addInputRef = (input) => {
    if (input && !refInputs.current.includes(input)) {
      refInputs.current.push(input);
    } else {
      return;
    }
  };

  const handleBlur = (e) => {
    const target = e.target;
    const idTarget = target.getAttribute('id');
    const copyErrorInputs = { ...errorInputs };
    if (idTarget === 'input-email-signIn') {
      const error = checkEmail(target);
      copyErrorInputs.emailInput = error;
    } else if (idTarget === 'input-pwd-signIn') {
      const error = checkPassword(target);
      copyErrorInputs.pwdInput = error;
    }
    setErrorInputs(copyErrorInputs);
  };

  const checkEmail = (target) => {
    const emailValue = target.value;
    const errorEmail = emailValue ? false : true;
    return errorEmail;
  };

  const checkPassword = (target) => {
    const pwdValue = target.value;
    const errorPassword =
      pwdValue && pwdValue.length >= 8 && pwdValue.length <= 60 ? false : true;
    return errorPassword;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const inputs = refInputs.current;
    const emailInput = inputs[0];
    const passwordInput = inputs[1];

    const errorEmail = checkEmail(emailInput);
    const errorPassword = checkPassword(passwordInput);

    if (errorEmail || errorPassword) {
      const newErrorInputs = {
        emailInput: errorEmail,
        pwdInput: errorPassword,
      };
      setErrorInputs(newErrorInputs);
      return;
    }
    const form = e.target;
    const email = emailInput.value;
    const password = passwordInput.value;

    try {
      const typeFetch = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      };
      await fetch('/api/user_api/login', typeFetch);
      form.reset();
      setBoxError({ visible: false, message: '' });
      router.push('/signIn');
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        setBoxError({
          visible: true,
          message:
            "Cette adresse email n'existe pas, saisissez une autre adresse email ou inscrivez-vous.",
        });
      } else if (error.code === 'auth/wrong-password') {
        setBoxError({
          visible: true,
          message: 'Le mot de passe est incorrecte, veuillez réessayer.',
        });
      } else if (error.code === 'auth/too-many-requests') {
        setBoxError({
          visible: true,
          message:
            'Vous avez fais trop de tentatives, veuillez patientez quelques instants.',
        });
      } else if (error.code === 'auth/invalid-email') {
        setBoxError({
          visible: true,
          message:
            'Vous avez fais trop de tentatives, veuillez patientez quelques instants.',
        });
      }
    }
  };

  return [errorInputs, boxError, handleBlur, handleSubmit, addInputRef];
}

export default useSignIn;
