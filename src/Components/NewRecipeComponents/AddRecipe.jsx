import './AddRecipe.css'

import { useState } from 'react';
import axios from 'axios';
import CopyRecipe from './CopyRecipe';

const AddRecipe = () => {
    const [state, setState] = useState({
        title: "",
        imageURL: "",
        servings: 0,
        timeToMake: 0,
        ingredients: [
            {
                id: 0,
                ingredient: '',
            },
        ],
        instructions: [
            {
                id: 0,
                instructionText: '',
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
    const handleServingsChange = (e) => setStateField('servings', e.target.value);
    const handleTimeToMakeChange = (e) => setStateField('timeToMake', e.target.value);

    const handleIngredientChange = (e, i) => {
        const newIngredients = [...state.ingredients];
        newIngredients[i].ingredient = e.target.value;
        setStateField("ingredients", newIngredients);
    };

    const handleAddIngredient = () => {
        const newId = Math.max(...state.ingredients.map((ingredient) => ingredient.id)) + 1;
        const newIngredients = [...state.ingredients, {
            id: newId,
            ingredient: ""
        }];
        setStateField('ingredients', newIngredients);
    };

    const handleDeleteIngredient = (i) => {
        const copyIngredient = [...state.ingredients];
        copyIngredient.splice(i, 1);
        setStateField('ingredients', copyIngredient);
    };

    const handleInstructionChange = (e, i) => {
        const newInstructions = [...state.instructions];
        newInstructions[i].instructionText = e.target.value;
        setStateField("instructions", newInstructions);
    };

    const handleAddInstruction = () => {
        const newId = Math.max(...state.instructions.map((instruction) => instruction.id)) + 1;
        const newInstructions = [...state.instructions, {
            id: newId,
            instructionText: ""
        }];
        setStateField('instructions', newInstructions);
    };

    const handleDeleteInstruction = (i) => {
        const copyInstructions = [...state.instructions];
        copyInstructions.splice(i, 1);
        setStateField('instructions', copyInstructions);
    };

    const isAddIngredientButtonDisabled = state.ingredients.some((ingredient) => {
        return ingredient.quantity === '' || ingredient.quantity === 0 || ingredient.ingredient.trim() === '';
    });

    const isAddInstructionButtonDisabled = state.instructions.some((instruction) => {
        return instruction.instructionText.trim() === '';
    });

    const shouldShowIngredientDeleteButton = state.ingredients.length > 1;
    const shouldShowInstructionsDeleteButton = state.instructions.length > 1;


    return (
        <div className='new-recipe-display'>
            <CopyRecipe state={state} setState={setState} />
            <div className='center-box'>
                <div className='center-line'></div>
            </div>
            <form className='form-div' onSubmit={(e) => e.preventDefault()}>
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
                                <div key={ingredient.id} className='can-delete'>
                                    <input type="text" className='long' placeholder='Quantity and Ingredient' name="ingredient" value={ingredient.ingredient} onChange={(e) => handleIngredientChange(e, i)} />
                                    {shouldShowIngredientDeleteButton && <button type='button' className='form-field-delete' onClick={() => handleDeleteIngredient(i)}>X</button>}
                                </div>
                            )
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
                            <div key={instruction.id} className='can-delete'>
                                <input type="text" className='long' placeholder='Instruction' name="instruction" value={instruction.instructionText} onChange={(e) => handleInstructionChange(e, i)} />
                                {shouldShowInstructionsDeleteButton && <button type='button' className='form-field-delete' onClick={() => handleDeleteInstruction(i)}>X</button>}
                            </div>
                        );
                    })}
                </div>
                <div className='add-button-div'>
                    <button disabled={isAddInstructionButtonDisabled} type='button' onClick={handleAddInstruction}>Next instruction</button>
                </div>
                <div className='form-submit'>
                    <button type="button" className='copy-submit-btn' onClick={postAddRecipeForm}>Submit</button>
                </div>
            </form >
        </div>
    )
}

export default AddRecipe;
