import React,{ Component} from 'react'
import  Button  from 'react-bootstrap/Button'
import 'bootstrap/dist/css/bootstrap.min.css'

class Button extends Component{
    render(){
        return(
            <div>
                <Button variant="primary">Primary</Button>{'     '}
            </div>
        );
    }
}

export default Button