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

  async function handleTorles(id: string){
    if(!confirm("Biztosan törölni szeretnéd")){
      return;
    }
    try{
      const respons = await fetch("http://localhost:3000/users/" + id, {
        method: "DELETE",

      });
      setUsers((elozo)=> elozo.filter((user) => user.id.toString()! == id));
    }catch(error){
      console.error(error)
    }
  }

  async function handleCreditUp(user: User){
    if(!confirm("Biztosan szeretnéd 1000-el emelni a kreditet")){
      return;
    }
    try{
      const respons = await fetch("http://localhost:3000/users/" + user.id, {
        method: "PATCH",
        headers: {"Content-type": "application.json"},
        body: JSON.stringify({kredit: user.kredit+1000})

      });
      setUsers((elozo)=> 
        elozo.map(u => 
          u.id === user.id ? {...u, kredit: user.kredit+1000}:u,
        )
      );
    }catch(error){
      console.error(error)
    }
  }
  async function handleCreditDown(user: User){
    if(!confirm("Biztosan szeretnéd 1000-el emelni a kreditet")){
      return;
    }
    try{
      const respons = await fetch("http://localhost:3000/users/" + user.id, {
        method: "PATCH",
        headers: {"Content-type": "application.json"},
        body: JSON.stringify({kredit: user.kredit-1000})

      });
      setUsers((elozo)=> 
        elozo.map(u => 
          u.id === user.id ? {...u, kredit: user.kredit-1000}:u,
        )
      );
    }catch(error){
      console.error(error)
    }
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
            <th>Kreditek</th>
            <th>Tankötelezetség</th>
            <th>Műveletek</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
          <tr key={user.id}>
            <td>{user.nev}</td>
            <td>{user.osztaly}</td>
            <td>{user.kredit}</td>
            <td>{(user.tankoteles) ? "tanköteles" : "nem tanköteles"}</td>
            <td>
              <button
              className="btn btn-danger btn-small"
              onClick={() => {handleTorles(user.id.toString())}}
              >Törlés</button>
              <button
              onClick={() => handleCreditUp(user)}
              >+1000</button>
              <button
              onClick={() => handleCreditDown(user)}
              >-1000</button>
            </td>
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
