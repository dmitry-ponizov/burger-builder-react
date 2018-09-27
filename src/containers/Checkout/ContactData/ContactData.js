import React, { Component } from 'react'
import Button from '../../../components/UI/Button/Button'
import classes from './ContactData.css'
import axios from '../../../axios-orders'
import Spinner from '../../../components/UI/Spinner/Spinner'
import Input from '../../../components/UI/Input/Input'
import { connect } from 'react-redux'

class ContactData extends Component {

    state = {
        orderForm:{
            name: {
                elementType:'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your name'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Zip code'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 5,
                    maxLength: 5
                },
                valid: false,
                touched: false
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your email'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options:[{
                        value:'fastest',
                        displayValue:'Fastest'
                        },
                    {
                        value: 'cheapest',
                        displayValue: 'Cheapest'
                    }]
                },
                validation: {},
                value: 'fastest',
                valid: true
              
            }
        },
        formIsValid: false,
        loading: false
    }

    orderHandler = (event) => {
       event.preventDefault();
       this.setState({loading:true})
       const fromData = {}
       for(let formElement in this.state.orderForm){
            fromData[formElement] = this.state.orderForm[formElement].value
       }
       const order = {
         ingredients: this.props.ings,
         price: this.props.price ,
         orderData: fromData
       }
         axios.post('https://burger-builder-b2c43.firebaseio.com/orders.json', order).then(response => {
              this.setState({loading: false})
            this.props.history.push('/')
         }).catch(error => {
          this.setState({loading: false})
         })
    }

    checkValidity(value, rules ){
        let isValid = true;

        if(!rules) {
            return true;
        }
        if(rules.required){
            isValid = value.trim() !== '' && isValid;
        }

        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid
        }

         if (rules.maxLength) {
             isValid = value.length <= rules.minLength && isValid
         }
        return isValid;
    }
    inputChangedHandler = (event, inputIdentifier) => {
        const updatedOrderForm = {
            ...this.state.orderForm,
        } 
        const updatedFromElement = {
            ...updatedOrderForm[inputIdentifier]
        }
        updatedFromElement.value = event.target.value;
        updatedFromElement.valid = this.checkValidity(updatedFromElement.value, updatedFromElement.validation)
        updatedFromElement.touched = true
        updatedOrderForm[inputIdentifier] = updatedFromElement

        let formIsValid = true;
        for(let inputIdentifier in updatedOrderForm){
            formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid
        }
        console.log(formIsValid)
        this.setState({
            orderForm: updatedOrderForm,
            formIsValid: formIsValid
        })
    }
    render() {
        const formElementsArray = [];
        for(let key in this.state.orderForm){
            formElementsArray.push({
                id:key,
                config: this.state.orderForm[key]
            })
        }
        let form = (
            <form onSubmit={this.orderHandler}>
                {formElementsArray.map(formElement => (
                    <Input 
                        key={formElement.id}
                        elementType={formElement.config.elementType}  
                        elementConfig={formElement.config.elementConfig} 
                        value={formElement.config.value} 
                        invalid={!formElement.config.valid}
                        shouldValidate={formElement.config.validation}
                        touched={formElement.config.touched}
                        changed={(event) => this.inputChangedHandler(event, formElement.id)}
                        />
                ))}
                <Button clicked={this.orderHandler} btnType="Success" disabled={!this.state.formIsValid} >ORDER</Button>
            </form>
        );
        if(this.state.loading) {
            form = < Spinner / >
        }
        return(
            <div className={classes.ContactData} >
                <h4>Enter your Contact Data</h4>
                { form }
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        ings: state.ingredients,
        price: state.totalPrice
    }
}
export default connect(mapStateToProps)(ContactData);