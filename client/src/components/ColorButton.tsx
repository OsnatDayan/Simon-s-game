import { ColorButtonModel } from "./Models/ColorButtonModel";

export default function ColorButton(props:ColorButtonModel){
    return (
        <>
            <div
                onClick={props.onclick}
                className={`colorCard ${props. color} ${props.flash ? 'flash' : ""} `} >
                
                </div>
        </>
    )
}