import { useEffect, useState } from "react"
import type { User } from "./type/types"
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {

  const [users, setUsers] = useState<User[]>([]);

  const [nev, setNev] = useState<string>("");
  const [osztaly, setOsztaly] = useState<string>("");

  useEffect(()=>{
    async function fetchusers(){
      try{
        const respons = await fetch("http://localhost:3000/users");
        const data: User[] = await respons.json();
        setUsers(data);
      }catch(err){
        console.log("Hiba történt" + err)
      }
    }
    fetchusers()
  }, []);

  async function handleFelhasznaloFelvetel(e){
    e.preventDefault();
    const ujFelhasznalo = {
      nev: nev,
      osztaly: osztaly
    };
    try{
      const respons = await fetch("http://localhost:3000/users", {
        "method": "POST",
        headers: {"Content-type": "application.json"},
        body: JSON.stringify(ujFelhasznalo)
      });
      const felhasznalo: User  = await respons.json();
      setUsers((elozo) => [...elozo, felhasznalo])
      setNev("");
      setOsztaly("")

    }catch(err){
      console.log("Hiba történt" + err)
    }
    console.log(ujFelhasznalo)
  }

  return (
    <>
      <h1>Felhaszanalok</h1>
      <h2>Felhasználók listája</h2>

      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>Név</th>
            <th>Osztály</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
          <tr key={user.id}>
            <td>{user.nev}</td>
            <td>{user.osztaly}</td>
          </tr>
          ))}
        </tbody>
      </table>

      <h2>Felhasználó felvétele</h2>

          <form onSubmit={handleFelhasznaloFelvetel}>
            <label htmlFor="input_nev">Add meg a neved</label><br />
            <input 
                  type="text"
                  value={nev} 
                  onChange={(e) =>setNev(e.target.value)}
            />
            <br />
            <label htmlFor="input_osztaly">Add meg az osztályod</label><br />
            <input 
                  type="text"
                  value={osztaly} 
                  onChange={(e) =>setOsztaly(e.target.value)}
            />
            <br />
            <button type="submit">Felvétel</button>
          </form>

    </>
  )
}

export default App
