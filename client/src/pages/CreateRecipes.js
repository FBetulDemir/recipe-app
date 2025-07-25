import { useEffect, useState } from "react";
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
        const [userID, setUserID] = useState(null);

    useEffect(() => {
        const storedUserID = window.localStorage.getItem("userID");
        setUserID(storedUserID);
    }, []);

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
            {userID ? (
                <>
                    <h1>Create a recipe to share!</h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="name">Name:</label>
                        <input type="text" id="name" name="name" onChange={handleChange} />

                        <label htmlFor="ingredients">Ingredients (comma-separated):</label>
                        <input type="text" id="ingredients" name="ingredients" onChange={handleChange} />

                        <label htmlFor="instructions">Instructions:</label>
                        <textarea id="instructions" name="instructions" onChange={handleChange}></textarea>

                        <label htmlFor="imageUrl">Image URL:</label>
                        <input type="text" id="imageUrl" name="imageUrl" onChange={handleChange} />

                        <label htmlFor="cookingTime">Cooking Time (minutes):</label>
                        <input type="number" id="cookingTime" name="cookingTime" onChange={handleChange} />

                        <button type="submit">Submit</button>
                    </form>
                </>
            ) : (
                <h2>Please log in to create a recipe.</h2>
            )}
        </div>
    );
}

export default CreateRecipe;