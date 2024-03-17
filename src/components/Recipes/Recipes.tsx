import { useState } from 'react';
import { useDebounce } from 'react-use';
import RecipeCard from '../RecipeCard/RecipeCard';
import SearchComponent from './SearchComponent/SearchComponent';

import { SelectedCategory } from '../../@types/recipe';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  fetchRandomRecipes,
  fetchSearchRecipe,
} from '../../store/reducers/recipes';
import CategoriesListBox from './Categories/CategoriesListBox';

function Recipes() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SelectedCategory>();

  const dispatch = useAppDispatch();

  const loading = useAppSelector((state) => state.recipes.loading);

  const modalIsOpen = useAppSelector((state) => state.settings.modalIsOpen);

  const recipes = useAppSelector((state) => state.recipes.list);

  useDebounce(
    () => {
      if (search || selectedCategory) {
        dispatch(
          fetchSearchRecipe({ search, category: selectedCategory?.name })
        );
      } else if (recipes.length === 0) {
        dispatch(fetchRandomRecipes({ count: 10 }));
      }
    },
    400,
    [dispatch, search, selectedCategory]
  );

  return (
    <div
      className={`my-10 px-3 sm:px-8 container mx-auto ${
        modalIsOpen ? 'sm:blur-[3px] sm:pointer-events-none' : ''
      }`}
    >
      <h1 className="text-titleff text-2xl sm:text-4xl font-bold md:mb-8 m-6 text-center">
        Find exactly what you need !
      </h1>
      <div className="flex gap-2 relative">
        <SearchComponent
          name="RecipeSearch"
          value={search}
          onChange={setSearch}
        />
        <CategoriesListBox
          value={selectedCategory}
          onChange={setSelectedCategory}
        />
      </div>

      {!loading && recipes.length === 0 && (
        <div className="text-center text-thirdff text-2xl font-bold mt-10 sm:mb-[400px]">
          No recipes found
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-6 mb-20 sm:mb-[400px]">
        {recipes.map((recipe) => (
          <RecipeCard recipe={recipe} key={recipe.idDbMeal} />
        ))}
      </div>
    </div>
  );
}

export default Recipes;
