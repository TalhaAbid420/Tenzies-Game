import { useEffect, useState } from "react";
import "./App.css"
import Dice from "./Dice"
import {nanoid} from 'nanoid';
import Confetti from 'react-confetti'


const App = () => {

    const [dice, setDice] = useState(allNewDice())
    const [tenzies, setTenzies] = useState(false)
    const [count, setCount] = useState(0)
    const [time, setTime] = useState(0);
    const [isActive, setIsActive] = useState(false)
    const [bestTime, setBestTime] = useState(() => {
        return localStorage.getItem("bestTime") ? parseInt(localStorage.getItem("bestTime")) : null;
    });
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        if(dice.some(die => die.isHeld) && !tenzies) {
            setIsActive(true);
        }
    }, [tenzies, dice])

    useEffect(() => {
        let timer;
        if (isActive) {
            timer = setInterval(() => {
                setTime(prevTime => prevTime + 1);
            }, 1000);
        } else if (!isActive && time !== 0) {
            clearInterval(timer);
        }
        return () => clearInterval(timer)
    }, [isActive])

    useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const allValuesSame = dice.every(die => die.value === dice[0].value)

        if(allHeld && allValuesSame) {
            setTenzies(true);
            setIsActive(false);
            setShowConfetti(true);

            if(!bestTime || time < bestTime) {
                setBestTime(time);
                localStorage.setItem("bestTime", time);
            }

            setTimeout(() => {
                setShowConfetti(false);
            }, 8000)
        }
    }, [dice, tenzies, bestTime, time])

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }

    function allNewDice() {
        const diceArr = [];
        for (let i = 0; i < 10; i++) {
            diceArr.push(generateNewDie())
        }
        return diceArr;
    }


    function holdDice(id) {
        setDice(oldDice => 
            oldDice.map(die => {
                return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die;
            })
        )
    }

    const diceElements = dice.map((die) => <Dice key={die.id}  value={die.value} isHeld={die.isHeld} holdDice={() => holdDice(die.id)} />)
    
    function RollDice() {
        if(tenzies) {
            setTenzies(false)
            setDice(allNewDice())
            setTime(0);
            setIsActive(true);
            setCount(0)
        } else {
            setCount(prevCount => prevCount + 1)
            setDice(oldDice => 
                oldDice.map(die => 
                    die.isHeld ? die :
                    generateNewDie()
                )
            )
        }
    }

    useEffect(() => {
        if (!tenzies) setIsActive(true)
    }, [tenzies])


  return (
    <main className="min-w-[280px] h-auto  bg-[#f7f7f7] flex items-center justify-around flex-col  rounded-md p-4 gap-5 lg:gap-7 ">
        {showConfetti && <Confetti/>}
        <div className="Details flex flex-col items-center justify-center gap-4">
        <h1 className="title text-4xl lg:text-5xl font-medium">Tenzies</h1>
        <p className="instructions text-md lg:text-2xl text-center">Roll until all dice are the same. Click each die  to freeze it at its current value between rolls.</p>
        </div>
        <h2 className="text-lg lg:text-xl text-blue-900">Total Number of Rolls: <span className="text-xl font-semibold">{count}</span></h2>
        <div className=" justify-center dices grid grid-rows-2 grid-cols-5 gap-x-2 gap-y-3 sm:gap-6 p-3 mb-4">
            {diceElements}
        </div>
        <button className="btn py-2 px-6 rounded-md bg-[#5035FD] text-2xl font-medium focus:outline-none  active:shadow-lg active:shadow-indigo-800 text-white" onClick={RollDice}>{tenzies ? "New Game" : "Roll Dice"}</button>
        <div className="flex justify-between  w-full items-center lg:font-medium">
        {bestTime !== null && <p className="text-lg text-blue-900 lg:text-2xl">Best Time: <span className="font-semibold">{bestTime}</span> seconds</p>}
        <p className="text-lg lg:text-2xl text-blue-900 text-right">Time: <span className="font-semibold">{time}</span> seconds</p>
        </div>
    </main>
  )
}

export default App