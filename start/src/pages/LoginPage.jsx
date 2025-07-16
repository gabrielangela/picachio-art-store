export default function LoginPage() {
  return (
    <div>
      <h1>Login Page</h1>
      <form action="">
        <div>
          <label htmlFor="">Username / Email:</label>
          <br />
          <input type="text" />
        </div>
        <div>
          <label htmlFor="">Password:</label>
          <br />
          <input type="password" />
        </div>
        <button>Login</button>
      </form>
    </div>
  );
}