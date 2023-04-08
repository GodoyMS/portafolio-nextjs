import Navbar from "../Navbar/Navbar";

export default function Layout({ children }) {
    return (
      <div className="mx-2 my-2 bg-slate-900">
        <Navbar/>

        
        
        <main className="dark:bg-slate-600">{children}</main>
   
      </div>
    );
  }