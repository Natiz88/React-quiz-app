import { useState } from "react";
import styles from "./Page.module.css";
import Questions from "./Questions/Questions";
import axios from "axios";
import Image1 from "./coverImage.jpg";
import Image2 from "./innerImage.jpg";

const Page = () => {
  const [data, setData] = useState("");
  const [name, setName] = useState("");
  const [inputError, setInputError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const handlePageLoading = () => {
    setTimeout(setIsPageLoading(true), 2000);
  };
  const url = `https://opentdb.com/api.php?amount=1&difficulty=easy&type=multiple`;
  function Fetch() {
    setIsDataLoading(true);
    axios.get(url).then((res) => {
      setData(
        res.data.results.map((questionItem, index) => {
          const answer = questionItem.correct_answer;
          const options = [...questionItem.incorrect_answers, answer];
          return {
            id: `${index}-${Date.now()}`,
            question: decode(questionItem.question),
            answer: answer,
            options: options.sort(() => Math.random() - 0.5),
          };
        })
      );
      setIsPageLoading(false);
      setIsDataLoading(false);
    });
  }
  const startQuiz = () => {
    if (name.length === 0) {
      setInputError(true);
      return;
    }
    Fetch();
  };
  function decode(str) {
    const textArea = document.createElement("textarea");
    textArea.innerHTML = str;
    return textArea.value;
  }

  return (
    <div className={styles.container}>
      <img
        src={isPageLoading ? Image1 : Image2}
        alt="baloon"
        className={styles.balloon}
      />
      {isPageLoading ? (
        <>
          <div className={styles.quizContainer}>
            <h1 className={styles.h1}>Enter Your Name to Start!</h1>
            <div className={styles.inputs}>
              <input
                type="text"
                value={name}
                placeholder="Enter your Name"
                onChange={(e) => setName(e.target.value)}
                className={inputError && styles.inputError}
              />
            </div>
            <div className={styles.start}>
              <button className={styles.button} onClick={() => startQuiz()}>
                Start Quiz
              </button>
            </div>
          </div>
        </>
      ) : (
        <div>
          <Questions
            data={data[0]}
            fetch={Fetch}
            isPageLoading={handlePageLoading}
            isLoad={isDataLoading}
            name={name}
          />
        </div>
      )}
    </div>
  );
};

export default Page;
