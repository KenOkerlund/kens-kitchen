/*
Need to:

1. be able to delete form rows in case someone messes up data entry

Find a way to be able to limit my quantity string to just digits and "/"
*/

import './AddRecipe.css'

import { useState } from 'react';
import axios from 'axios';
import CopyRecipe from './CopyRecipe';

function filterNonDigitsAndMakeNumber(stringWithPossibleNonDigits) {
    return Number(stringWithPossibleNonDigits.replace(/[^0-9]/g, ''));
};

function filterNonDigitsAndSlash(stringWithPossibleNonDigitsOrSlash) {
    return stringWithPossibleNonDigitsOrSlash.replace(/^[0-9\/]*$/)
}


const AddRecipe = () => {
    const [state, setState] = useState({
        title: "",
        imageURL: "",
        servings: 0,
        timeToMake: 0,
        ingredients: [
            {
                quantity: "",
                ingredient: '',
            },
        ],
        instructions: [
            {
                instructionText: ''
            },
        ]
    });

    function postAddRecipeForm() {
        axios.post('http://localhost:5432/add-recipe/submit', { body: state })
            .then(res => {
                console.log(res.data);
            })
    };

    const setStateField = (name, value) => {
        setState({
            ...state,
            [name]: value
        });
    };

    const handleNameChange = (e) => setStateField('title', e.target.value);
    const handleImageURLChange = (e) => setStateField('imageURL', e.target.value);
    const handleServingsChange = (e) => setStateField('servings', filterNonDigitsAndMakeNumber(e.target.value));
    const handleTimeToMakeChange = (e) => setStateField('timeToMake', filterNonDigitsAndMakeNumber(e.target.value));

    const handleIngredientQuantityChange = (e, i) => {
        const newIngredients = [...state.ingredients];
        // newIngredients[i].quantity = filterNonDigitsAndMakeNumber(e.target.value);
        // newIngredients[i].quantity = filterNonDigitsAndSlash(e.target.value);
        newIngredients[i].quantity = e.target.value;
        setStateField("ingredients", newIngredients);
    };

    const handleIngredientIngredientChange = (e, i) => {
        const newIngredients = [...state.ingredients];
        newIngredients[i].ingredient = e.target.value;
        setStateField("ingredients", newIngredients);
    };

    const handleAddIngredient = () => {
        const newIngredients = [...state.ingredients, {
            quantity: "",
            ingredient: ""
        }];
        setStateField('ingredients', newIngredients)
    };

    const handleInstructionChange = (e, i) => {
        const newInstructions = [...state.instructions];
        newInstructions[i].instructionText = e.target.value;
        setStateField("instructions", newInstructions);
    };

    const handleAddInstruction = () => {
        const newInstructions = [...state.instructions, {
            instructionText: ""
        }];
        setStateField('instructions', newInstructions);
    };

    const handleDeleteInstruction = (i) => {

        console.log(i)
        const index = i;
        const copyInstructions = [...state.instructions];

        const newInstructions =copyInstructions.filter((instruction, i) => {
            return i !== index;
        })
        console.log(newInstructions)
        setStateField('instructions', newInstructions);
    }

    const isAddIngredientButtonDisabled = state.ingredients.some((ingredient) => {
        return ingredient.quantity === '' || ingredient.quantity === 0 || ingredient.ingredient.trim() === '';
    });

    const isAddInstructionButtonDisabled = state.instructions.some((instruction) => {
        return instruction.instructionText.trim() === '';
    });


    return (
        <div className='new-recipe-display'>
            <CopyRecipe state={state} setState={setState} />
            <div className='center-box'>
                <div className='center-line'></div>
            </div>
            <form className='form-div' onSubmit={postAddRecipeForm}>
                <h4>From Scratch:</h4>
                <div className='double-form'>
                    <div className='form-input'>
                        <label htmlFor='recipeTitle'>Title of your Recipe</label>
                        <input type="text" placeholder='Recipe Name' name="title" value={state.title} onChange={handleNameChange} />
                    </div>
                    <div className='form-input'>
                        <label htmlFor='imageURL'>Paste the image URL</label>
                        <input type="text" placeholder='Image URL' name="imageURL" value={state.imageURL} onChange={handleImageURLChange} />
                    </div>
                </div>
                <div className='double-form'>
                    <div className='form-input'>
                        <label htmlFor='servings'>Servings</label>
                        <input type="text" placeholder='Servings' name="servings" value={state.servings} onChange={handleServingsChange} />
                    </div>
                    <div className='form-input'>
                        <label htmlFor='timeToMake'>Time to make (minutes)</label>
                        <input type="text" placeholder='Time to make' name="timeToMake" value={state.timeToMake} onChange={handleTimeToMakeChange} />
                    </div>
                </div>
                <div className='double-form'>
                    <div className='form-input'>
                        <label htmlFor='ingredient'>Ingredient</label>
                        {state.ingredients.map((ingredient, i) => {
                            return (
                                <div key={i}>
                                    <input type="text" placeholder='Measurement and Ingredient' name="ingredient" value={ingredient.ingredient} onChange={(e) => handleIngredientIngredientChange(e, i)} />
                                </div>
                            )
                        })}
                    </div>
                    <div className='form-input'>
                        <label htmlFor="quantity">Quantity</label>
                        {state.ingredients.map((ingredient, i) => {
                            return (
                                <div key={i} className='can-delete'>
                                    <input type="text" placeholder='Quantity' name="quantity" value={ingredient.quantity} onChange={(e) => handleIngredientQuantityChange(e, i)} />
                                    <button type='button' className='form-field-delete'>X</button>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className='add-button-div'>
                    <button disabled={isAddIngredientButtonDisabled} type="button" onClick={handleAddIngredient}>Next ingredient</button>
                </div>
                <div className='form-input'>
                    <label htmlFor='instruction'>Instruction</label>
                    {state.instructions.map((instruction, i) => {
                        return (
                            <div key={i} className='can-delete'>
                                <input type="text" className='long' placeholder='Instruction' name="instruction" value={instruction.instruction} onChange={(e) => handleInstructionChange(e, i)} />
                                <button type='button' className='form-field-delete' onClick={() => handleDeleteInstruction(i)}>X</button>
                            </div>
                        );
                    })}
                </div>
                <div className='add-button-div'>
                    <button disabled={isAddInstructionButtonDisabled} type='button' onClick={handleAddInstruction}>Next instruction</button>
                </div>
                <div className='form-submit'>
                    <button type='submit' className='copy-submit-btn'>Submit</button>
                </div>
            </form >
        </div>
    )
}

export default AddRecipe;
