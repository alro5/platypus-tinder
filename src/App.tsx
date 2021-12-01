import { useEffect, useRef, useState } from 'react';
import { User, Response } from './models/models';
import './styles/app.scss';

async function fetchUsers(results: number = 3): Promise<Response> {
  const response = await fetch(`https://randomuser.me/api/?results=${results}`);

  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }

  const users = await response.json();

  return users;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const cardListRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const response = fetchUsers();
    response
      .then(r => setUsers(r.results))
      .catch(error => {
        console.error("Error: ", error)
      });
  }, []);

  function updateList(liked: boolean) {
    const response = fetchUsers(1);

    response.then(r => {
      const newUser = r.results;
      const newArr = users.slice(1).concat(newUser);
      const firstCard = cardListRef.current!.querySelector('li:first-child')!;

      firstCard.classList.add(liked ? 'liked' : 'pass')
      firstCard.classList.add('remove');

      (firstCard as HTMLLIElement).ontransitionend = () => {
        setUsers(newArr);
        firstCard.className = "card";
      }
    }).catch(error => {
      console.error("Error: ", error)
    });
  }

  return (
    <div className="app">
      <img width="50" alt="Platypus logo" src="https://assets.website-files.com/5dc0238d8b3107d8b593f3fd/5f49117a5e3c9680fc678b82_Website-Icon.svg" />
      <h1>Platypus <span>Tinder</span></h1>
      <div className="cards">
        <ul ref={cardListRef}>
          {users.map((user, index) => {
            return <li className={"card"} key={index}>
              <img src={user.picture.large} alt={user.name.first} />
              <div className="card__content">
                <p>{user.name.first}, {user.dob.age}</p>
              </div>
            </li>
          })}
        </ul>
      </div>
      <div className="actions">
        <button onClick={() => updateList(false)} type="button">❌</button>
        <button onClick={() => updateList(true)} type="button">💚</button>
      </div>
    </div>
  );
}

export default App;
