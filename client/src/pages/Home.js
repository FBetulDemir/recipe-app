import { useCallback, useEffect, useMemo, useState } from 'react';
import { useCookies } from 'react-cookie';
import { api, API_BASE } from '../api';
import MainBanner from '../components/MainBanner';
import { useGetUserID } from '../hooks/useGetUserID';
import '../styles/Home.css';
import '../styles/SavedRecipes.css';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]); // array of IDs (strings)
  const [cookies] = useCookies(['access_token']);
  const userID = useGetUserID();

  const fetchRecipes = useCallback(async () => {
    try {
      const { data } = await api.get('/recipes');
      setRecipes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching recipes:', err);
    }
  }, []);

  const fetchSavedIDs = useCallback(async () => {
    if (!userID) {
      setSavedRecipes([]);
      return;
    }
    try {
      const { data } = await api.get(`/recipes/savedRecipes/ids/${userID}`, {
        headers: { Authorization: `Bearer ${cookies.access_token || ''}` },
      });
      setSavedRecipes(Array.isArray(data?.savedRecipes) ? data.savedRecipes : []);
    } catch (err) {
      console.error('Error fetching saved recipe IDs:', err);
      setSavedRecipes([]);
    }
  }, [userID, cookies.access_token]);

  useEffect(() => {
    fetchRecipes();
    fetchSavedIDs();
  }, [fetchRecipes, fetchSavedIDs]);

  const saveRecipe = async (recipeID) => {
    try {
      await api.put(
        '/recipes',
        { recipeID },
        { headers: { Authorization: `Bearer ${cookies.access_token || ''}` } }
      );
      await fetchSavedIDs(); // refresh after save
    } catch (err) {
      console.error('Error saving recipe:', err);
    }
  };

  const savedIdSet = useMemo(() => new Set(savedRecipes.map(String)), [savedRecipes]);
  const isRecipeSaved = (id) => savedIdSet.has(String(id));

  return (
    <div className="home">
      <div className="banner">
        <MainBanner />
      </div>

      <h1>Welcome to Herb & Heat</h1>

      <ul className="recipe-list">
        {recipes.map((recipe) => (
          <li key={recipe._id}>
            <div className="recipe-item">
              <h2>{recipe.name}</h2>

              {userID ? (
                <button onClick={() => saveRecipe(recipe._id)} disabled={isRecipeSaved(recipe._id)}>
                  {isRecipeSaved(recipe._id) ? 'Saved' : 'Save'}
                </button>
              ) : (
                <button disabled>Login to Save</button>
              )}

              <p>{recipe.instructions}</p>
              <img src={recipe.imageUrl} alt={recipe.name} />
              <p>Cooking Time: {recipe.cookingTime} minutes</p>
              <p>
                Ingredients:{' '}
                {Array.isArray(recipe.ingredients) ? recipe.ingredients.join(', ') : ''}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
