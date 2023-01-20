import Link from 'next/link';
import Image from 'next/image';
import Logo from '../public/assets/logo.png';
import styles from '/styles/Form.module.css';
import useRegister from '../hooks/useRegister';
import BackgroundImage from '../public/assets/background.jpg';

function Register() {
  const [errorInputs, boxError, handleBlur, handleSubmit, addInputRef] =
    useRegister();

  return (
    <>
      <Image className={styles.logo} src={Logo} alt='logo du service' />
      <div className={styles.backgroundContainer}>
        <Image src={BackgroundImage} alt='image de fond' />
        <div className={styles.backgroundOpacity}></div>
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1 className={styles.titleForm}>Inscription</h1>
        {boxError.visible && (
          <p className={styles.messageBoxError}>{boxError.message}</p>
        )}
        <div className={styles.inputGroupForm}>
          <label htmlFor='input-email-register'>Email</label>
          <input
            ref={addInputRef}
            onBlur={handleBlur}
            type='text'
            id='input-email-register'
            className={
              errorInputs.emailInput ? styles.errorInputForm : undefined
            }
          />
          {errorInputs.emailInput && (
            <p className={styles.messageErrorInput}>
              Veuillez entrer un email valide.
            </p>
          )}
        </div>
        <div className={styles.inputGroupForm}>
          <label htmlFor='input-pwd-register'>Mot de passe</label>
          <input
            ref={addInputRef}
            onBlur={handleBlur}
            type='password'
            id='input-pwd-register'
            className={errorInputs.pwdInput ? styles.errorInputForm : undefined}
          />
          {errorInputs.pwdInput && (
            <p className={styles.messageErrorInput}>
              Minimum 8 caractères, 1 majuscule et 1 chiffre.
            </p>
          )}
        </div>
        <div className={styles.inputGroupForm}>
          <label htmlFor='input-confirm-pwd-register'>
            Confirmer le mot de passe
          </label>
          <input
            ref={addInputRef}
            onBlur={handleBlur}
            type='password'
            id='input-confirm-pwd-register'
            className={
              errorInputs.confirmPwdInput ? styles.errorInputForm : undefined
            }
          />
          {errorInputs.confirmPwdInput && (
            <p className={styles.messageErrorInput}>
              Pas de mot de passe ou ils ne correspondent pas.
            </p>
          )}
        </div>
        <button>S'inscrire</button>
        <p className={styles.infoForm}>
          Déjà un compte Nasflix ? <Link href='/signIn'>Connectez-vous.</Link>
        </p>
      </form>
    </>
  );
}

export default Register;
