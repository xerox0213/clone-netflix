import { useRouter } from 'next/router';
import { useState, useRef } from 'react';

function useRegister() {
  const [boxError, setBoxError] = useState({
    visible: false,
    message: '',
  });
  const [errorInputs, setErrorInputs] = useState({
    emailInput: false,
    pwdInput: false,
    confirmPwdInput: false,
  });
  const inputsRef = useRef([]);
  const router = useRouter();

  const addInputRef = (input) => {
    if (input && !inputsRef.current.includes(input)) {
      inputsRef.current.push(input);
    } else {
      return;
    }
  };

  const handleBlur = (e) => {
    const target = e.target;
    const idTarget = target.getAttribute('id');
    const copyErrorInputs = { ...errorInputs };
    if (idTarget === 'input-email-register') {
      const error = checkEmail(target);
      copyErrorInputs.emailInput = error;
    } else if (idTarget === 'input-pwd-register') {
      const error = checkPassword(target);
      copyErrorInputs.pwdInput = error;
    } else if (idTarget === 'input-confirm-pwd-register') {
      const error = checkConfirmPassword(target);
      copyErrorInputs.confirmPwdInput = error;
    }
    setErrorInputs(copyErrorInputs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const inputs = inputsRef.current;
    const [emailInput, passwordInput, confirmPasswordInput] = inputs;
    const errorEmail = checkEmail(emailInput);
    const errorPassword = checkPassword(passwordInput);
    const errorConfirmPassword = checkConfirmPassword(confirmPasswordInput);

    if (errorEmail || errorPassword || errorConfirmPassword) {
      const newErrorInputs = {
        emailInput: errorEmail,
        pwdInput: errorPassword,
        confirmPwdInput: errorConfirmPassword,
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
      fetch('/api/user_api/register', typeFetch);
      form.reset();
      setBoxError({ visible: false, message: '' });
      router.push('/signIn');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setBoxError({
          visible: true,
          message:
            'Désolé cet email est déjà utilisé. Connectez-vous ou utiliser une autre addresse email.',
        });
      } else {
        console.dir(error);
      }
    }
  };

  const checkEmail = (target) => {
    const emailValue = target.value;
    const emailRegex = /^[a-zA-Z]([\.\_-]?[\w]+)+@[\w]+\.[a-z]{2,3}$/;
    const errorEmail = emailRegex.test(emailValue) ? false : true;
    return errorEmail;
  };

  const checkPassword = (target) => {
    const pwdValue = target.value;
    const majuscule = /[A-Z]+/;
    const minuscule = /[a-z]+/;
    const numbers = /[0-9]+/;
    const minimumLengthPwd = 8;
    if (
      majuscule.test(pwdValue) &&
      minuscule.test(pwdValue) &&
      numbers.test(pwdValue) &&
      pwdValue.length >= minimumLengthPwd
    ) {
      return false;
    } else {
      return true;
    }
  };

  const checkConfirmPassword = (target) => {
    const passwordValue = inputsRef.current[1].value;
    const confirmPwdValue = target.value;
    return confirmPwdValue && confirmPwdValue === passwordValue ? false : true;
  };

  return [errorInputs, boxError, handleBlur, handleSubmit, addInputRef];
}

export default useRegister;
