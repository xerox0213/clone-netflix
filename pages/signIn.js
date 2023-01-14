import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Logo from '/public/assets/logo.png';
import useSignIn from '../hooks/useSignIn';
import styles from '/styles/Form.module.css';
import BackgroundImage from '/public/assets/background.jpg';

function SignIn() {
  const [
    errorInputs,
    boxError,
    handleBlur,
    handleSubmit,
    addInputRef,
    currentUser,
  ] = useSignIn();

  const router = useRouter();

  if (currentUser) {
    router.push('/home');
    return;
  }

  return (
    <>
      <Image
        priority
        className={styles.logo}
        src={Logo}
        alt='logo du service'
      />
      <div className={styles.backgroundContainer}>
        <Image src={BackgroundImage} alt='image de fond' priority />
        <div className={styles.backgroundOpacity}></div>
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1 className={styles.titleForm}>Connexion</h1>
        {boxError.visible && (
          <p className={styles.messageBoxError}>{boxError.message}</p>
        )}
        <div className={styles.inputGroupForm}>
          <label htmlFor='input-email-signIn'>Email</label>
          <input
            ref={addInputRef}
            onBlur={handleBlur}
            type='text'
            id='input-email-signIn'
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
          <label htmlFor='input-pwd-signIn'>Mot de passe</label>
          <input
            ref={addInputRef}
            onBlur={handleBlur}
            type='password'
            id='input-pwd-signIn'
            className={errorInputs.pwdInput ? styles.errorInputForm : undefined}
          />
          {errorInputs.pwdInput && (
            <p className={styles.messageErrorInput}>
              Le mot de passe doit contenir entre 8 et 60 caractères.
            </p>
          )}
        </div>
        <button>Se connecter</button>
        <p className={styles.infoForm}>
          Nouveau sur Nasflix ? <Link href='/'>Inscrivez-vous.</Link>
        </p>
      </form>
    </>
  );
}

export default SignIn;
