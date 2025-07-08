import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../styles/CreateRecipes.css';

const CreateRecipe = () => {
    const [recipe, setRecipe] = useState({
        name: '',
        ingredients: [],
        instructions: '',
        imageUrl: '',
        cookingTime: 0,
    })

    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value} = event.target;
        setRecipe({...recipe, [name]: value})
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const userID = window.localStorage.getItem("userID");
        // Convert ingredients to an array if it's a string (from input)
        const formattedRecipe = {
            ...recipe,
            ingredients: typeof recipe.ingredients === "string"
            ? recipe.ingredients.split(",").map(i => i.trim()).filter(Boolean)
            : recipe.ingredients,
            userOwner: userID,
        };

        try {
            await axios.post("http://localhost:3001/recipes", formattedRecipe);
            console.log("Recipe created successfully:", formattedRecipe);
            alert("Recipe created successfully!");
            navigate("/")
        } catch (error) {
            console.error("Error creating recipe: ", error)
        }
    }

    return (
        <div className="create-recipe">
            <h1>Create</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Name: </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    onChange={handleChange}
                />

                <label htmlFor="ingredients" placeholder="comma separated">
                    Ingredients:
                </label>
                <input
                    type="text"
                    id="ingredients"
                    name="ingredients"
                    onChange={handleChange}
                />

                <label htmlFor="instructions">Instructions: </label>
                <textarea
                    type="text"
                    id="instructions"
                    name="instructions"
                    onChange={handleChange}
                ></textarea>

                <label htmlFor="imageUrl">Image Url: </label>
                <input
                    type="text"
                    id="imageUrl"
                    name="imageUrl"
                    onChange={handleChange}
                />

                <label htmlFor="cookingTime">Cooking Time (minutes): </label>
                <input
                    type="number"
                    id="cookingTime"
                    name="cookingTime"
                    onChange={handleChange}
                />

                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default CreateRecipe;