import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { api } from '../api';
import { useGetUserID } from '../hooks/useGetUserID';
import '../styles/SavedRecipes.css';

const SavedRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [cookies] = useCookies(['access_token']);
  const userID = useGetUserID();

  useEffect(() => {
    const fetchSavedRecipeDocs = async () => {
      if (!userID) return;
      try {
        const { data } = await api.get(`/recipes/savedRecipes/${userID}`, {
          headers: { Authorization: `Bearer ${cookies.access_token || ''}` },
        });
        setSavedRecipes(Array.isArray(data?.savedRecipes) ? data.savedRecipes : []);
      } catch (error) {
        console.error('Error fetching saved recipes:', error);
      }
    };
    fetchSavedRecipeDocs();
  }, [userID, cookies.access_token]);

  const removeFromSaved = async (recipeID) => {
    try {
      await api.put(
        '/recipes/unsave',
        { recipeID },
        { headers: { Authorization: `Bearer ${cookies.access_token || ''}` } }
      );
      setSavedRecipes((prev) => prev.filter((r) => String(r._id) !== String(recipeID)));
    } catch (err) {
      console.error('Failed to remove recipe:', err);
    }
  };

  if (!userID) {
    return (
      <div className="saved-recipes">
        <h1>Saved Recipes</h1>
        <p>Please log in to view your saved recipes.</p>
      </div>
    );
  }

  if (savedRecipes.length === 0) {
    return (
      <div className="saved-recipes">
        <h1>Saved Recipes</h1>
        <p>You did not save any recipes!</p>
      </div>
    );
  }

  return (
    <div className="saved-recipes">
      <h1>Saved Recipes</h1>
      <ul className="recipe-list">
        {savedRecipes.map((recipe) => (
          <li key={recipe._id}>
            <div className="recipe-item">
              <button className="remove-btn" onClick={() => removeFromSaved(recipe._id)}>
                Remove from Saved
              </button>
              <h2>{recipe.name}</h2>
              <p>{recipe.instructions}</p>
              <img src={recipe.imageUrl} alt={recipe.name} />
              <p>Cooking Time: {recipe.cookingTime} minutes</p>
              <h3>Ingredients:</h3>
              <ul>
                {Array.isArray(recipe.ingredients) &&
                  recipe.ingredients.map((ingredient, idx) => <li key={idx}>{ingredient}</li>)}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SavedRecipes;
