import "./Questions.css";
import { useState, useEffect } from "react";
import { GiReturnArrow } from "react-icons/gi";
import { MdOutlineNextPlan } from "react-icons/md";
import { TailSpin } from "react-loading-icons";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";

const Questions = ({ data, fetch, isPageLoading, isLoad, name }) => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState();

  const checkResult = (ans) => {
    setSelected(ans);
    let correct = data.answer;
    if (ans === correct) {
      setScore((prev) => prev + 10);
    } else {
      if (score > 0) {
        setTimeout(() => setIsModalOpen(false), 1000);
        setIsModalOpen(true);
        setSelected();
        fetch();
      }
      setScore(0);
    }
  };

  useEffect(() => {
    const hscore = localStorage.getItem("highScore");
    setHighScore(hscore);
    if (score > hscore) {
      setHighScore(score);
      localStorage.setItem("highScore", score);
    }
  }, [score]);

  const handleSelect = (ans) => {
    let correct = data.answer;
    if (selected === ans && ans === correct) {
      return "green";
    } else if (selected === ans && ans !== correct) {
      return "error";
    } else if (ans === correct) {
      return "green";
    }
  };
  const nextQuestion = () => {
    setSelected();
    fetch();
  };

  return (
    <div className="container">
      <div className="qestionContainer">
        <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} center>
          <h1></h1>
          <h3>Incorrect Answer. The scoreboard was reset.</h3>
        </Modal>
        <button className="home" onClick={isPageLoading}>
          <GiReturnArrow /> Home
        </button>
        <h1 className="name">Hi {name}, welcome to the Quiz!</h1>
        <div className="scoreboard">
          <h3>Current Score: {score}</h3>
          <h3>Highest Score: {highScore}</h3>
        </div>
        <div className="questions">
          {isLoad ? (
            <TailSpin className="spin" />
          ) : (
            <>
              <h3>{data.question}</h3>
              <div className="buttons">
                {data.options.map((option) => (
                  <button
                    disabled={selected}
                    className={`options ${selected && handleSelect(option)}`}
                    onClick={() => checkResult(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <div className="nextCont">
                <button onClick={nextQuestion} className="next">
                  Next <MdOutlineNextPlan className="nextIcon" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default Questions;
