import axios from "axios";
import { useEffect, useState } from "react";

const Home = () => {
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await axios.get ("http://localhost:3001/recipes");
                setRecipes(response.data)
                console.log (response.data)
            } catch (error) {
                console.error("Error fetching recipes:", error)
            }
        }

        fetchRecipe();
    }, []);



    return (
        <div className="home">
            <h1>Welcome</h1>
            <ul className="recipe-list">
                {recipes.map((recipe) => (
                    <li key={recipe._id}>
                        <div className="recipe-item">
                            <h2>{recipe.name}</h2>
                            <p>{recipe.instructions}</p>
                            <img src={recipe.imageUrl} alt={recipe.name}/>
                            <p>Cooking Time: {recipe.cookingTime} minutes</p>
                            <p>Ingredients: {recipe.ingredients.join(", ")}</p>
                        </div>
                    </li>
                )
                )}
            </ul>
        </div>
        
    )
}

export default Home;