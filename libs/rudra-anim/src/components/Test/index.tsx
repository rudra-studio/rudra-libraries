import applyCrush from '../../utils/applyCrush';
import applySpin from '../../utils/applySpin';
import applyReactionPop from '../../utils/applyReactionPop'
import { useRef } from 'react';


const MyButton = () => {

  const ref = useRef();

  return (

    <>

    <div ref={ref} style={
      {
        height: "100px",
        width: "100px",
      }
    }>SSivasankar</div>
    <button 
      // Look here! e.currentTarget passes the exact DOM node to GSAP safely.
      onClick={(e) => {
        console.log("I am here");
          applyReactionPop({ container: ref?.current }); 
      }} 
      className="bg-red-500 p-4 text-white font-bold rounded"
    >
      Delete Record
    </button>
    </>
  );
};

export default MyButton;