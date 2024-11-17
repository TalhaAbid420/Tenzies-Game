// Dice.js

const Dice = (props) => {
  const styles = { backgroundColor: props.isHeld ? "#59E391" : "white" };

  function renderDots() {
    const dots = [];
    const dotPositions = {
      1: [[45, 45]],
      2: [[25, 25], [65, 65]],
      3: [[20, 20], [45, 45], [70, 70]],
      4: [[20, 20], [20, 70], [70, 20], [70, 70]],
      5: [[20, 20], [20, 70], [45, 45], [70, 20], [70, 70]],
      6: [[20, 20], [20, 45], [20, 70], [70, 20], [70, 45], [70, 70]],
    };

    dotPositions[props.value].forEach(([top, left], index) => {
      dots.push(
        <span
          key={index}
          className="bg-[#333] rounded-full w-[5px] h-[5px] lg:w-[10px] lg:h-[10px] absolute"
          style={{ top: `${top}%`, left: `${left}%` }}
        ></span>
      );
    });

    return dots;
  }

  return (
    <div
      className="relative  w-10 h-10 lg:w-16 lg:h-16 border shadow-lg rounded-md flex items-center justify-center  cursor-pointer"
      style={styles}
      onClick={props.holdDice}
    >
      {renderDots()}
    </div>
  );
};

export default Dice;
