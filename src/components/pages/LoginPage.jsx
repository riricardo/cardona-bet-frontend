export default function LoginPage() {
  return (
    <div className="flex flex-col h-screen justify-center items-center gap-4">
      <div className="flex items-center">
        <img
          className="h-24 w-24 animate-spin-slow"
          src="./icon.png"
          alt="Logo"
        />
        <h1 className="casino-text mt-2">Cardona Bet</h1>
      </div>
      <button className="btn btn-accent">
        Login with google
        <i className="fa-brands fa-google"></i>
      </button>
    </div>
  );
}
