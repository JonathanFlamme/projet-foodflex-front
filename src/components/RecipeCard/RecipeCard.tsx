import { useEffect, useMemo, useState } from 'react';
import { Heart, Plus, Shuffle, X } from 'react-feather';
import { Link } from 'react-router-dom';
import { MealAdd, Recipe } from '../../@types/recipe';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { changeStateModalAnimation } from '../../store/reducers/favoris';
import {
  addFavori,
  addSchedule,
  addScheduleFavori,
  deleteFavori,
  displaySchedule,
  toggleIsOpen,
  toggleSignUpOpen,
  deleteMeal,
} from '../../store/reducers/settings';
import './RecipeCard.css';

interface CardProps {
  recipe: Recipe;
}

function RecipeCard({ recipe }: CardProps) {
  const [recipeFavori, setRecipeFavori] = useState(false);
  const isLogged = useAppSelector((state) => state.settings.isLogged);
  const stateSchedule = useAppSelector((state) => state.schedule.stateSchedule);
  const modaleFavoriIsOpen = useAppSelector(
    (state) => state.favoris.modalIsOpen
  );
  const MealFavoriToAdd = useAppSelector(
    (state) => state.settings.MealFavoriToAdd
  );
  const clickAddFavori = useAppSelector(
    (state) => state.schedule.clickAddSchedule
  );
  const displayScheduleModal = useAppSelector(
    (state) => state.settings.clickAddSchedule
  );

  const favoris = useAppSelector(
    (state) => state.settings.currentUser.favorites
  );
  const currentWeek = useAppSelector((state) => state.settings.currentWeek);
  const dispatch = useAppDispatch();
  function handleClickDay() {
    const newMeal = {
      idDbMeal: MealFavoriToAdd.idDbMeal,
      name: MealFavoriToAdd.name,
      image: MealFavoriToAdd.image,
      position: recipe.position,
    };
    dispatch(addScheduleFavori(newMeal));
    dispatch(addSchedule({ meals: newMeal, week: currentWeek }));
  }
  // Function to handle adding the recipe to the schedule
  function handleAddSchedule(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    dispatch(displaySchedule(!clickAddFavori));
    dispatch(addScheduleFavori(recipe));

    window.scrollTo({
      behavior: 'smooth',
      top: 0,
    });
  }

  // useCallback to memoize the searchFavori function and prevent unnecessary
  // re-renders
  const matchingFavori = useMemo(() => {
    const findFavori = favoris.find(
      (favori) => favori.idDbMeal === recipe.idDbMeal
    );
    return findFavori;
  }, [favoris, recipe.idDbMeal]);

  // Function to handle adding the recipe to favorites
  function handleAddFavori(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (!matchingFavori) {
      dispatch(addFavori(recipe));
      setRecipeFavori(true);
    } else {
      dispatch(deleteFavori(matchingFavori.id));
      setRecipeFavori(false);
    }
  }

  // Function to handle delete the recipe to schedule
  function handleDeleteMeal(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    dispatch(deleteMeal(recipe.id));
  }

  // Function to handle shuffle when there are No Recipe
  async function handleShuffleMeal(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/random.php`
    );
    const data = await response.json();

    const meal = data.meals[0];

    const uniqueMeal: MealAdd = {
      idDbMeal: meal.idMeal,
      name: meal.strMeal,
      image: meal.strMealThumb,
      position: recipe.position,
    };

    dispatch(addSchedule({ meals: uniqueMeal, week: currentWeek }));
  }

  // useEffect to check if the recipe is in favorites and update recipeFavori
  // accordingly
  useEffect(() => {
    if (displayScheduleModal) {
      dispatch(changeStateModalAnimation(1));
    }
  }, [dispatch, displayScheduleModal]);

  useEffect(() => {
    if (matchingFavori) {
      setRecipeFavori(true);
    } else {
      setRecipeFavori(false);
    }
  }, [recipe, matchingFavori]);

  const toggleSignUp = () => {
    dispatch(toggleSignUpOpen());
    dispatch(toggleIsOpen());
  };
  const stateHome = useAppSelector((state) => state.home.stateHome);

  return (
    <Link
      to={`/recipes/${recipe.idDbMeal}`}
      className={`shadow-md rounded-lg relative hover:shadow-lg transition-all  ${
        displayScheduleModal
          ? 'pointer-events-auto border-2 border-thirdff'
          : ''
      }`}
      onClick={(event: { preventDefault: () => void }) => {
        if (displayScheduleModal) {
          event.preventDefault();
          handleClickDay();
        }
      }}
    >
      <img
        src={recipe.image}
        alt={recipe.name}
        className={`rounded-t-md cover ${
          (stateSchedule || displayScheduleModal) && recipe.id === 1
            ? 'blur-[3px] pointer-events-none opacity-60'
            : ''
        }
        ${
          (stateSchedule || displayScheduleModal) && recipe.id !== 1
            ? 'blur-[1px] pointer-events-none opacity-80'
            : ''
        }`}
      />
      <div
        className={` ${stateHome ? 'hidden' : ''}
          ${displayScheduleModal ? '' : 'hidden'}`}
      >
        <div className="bg-black opacity-40 w-24 h-10 rounded-lg absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]" />
        <h2 className="text-white font-bold p-2 text-center truncate text-sm sm:text-md absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
          {recipe.id === 1 ? 'Add here !' : 'Replace'}
        </h2>
      </div>
      <div className="text-bgff absolute top-2 right-1 ">
        <div
          className={`card-actions justify-end bg-t ${stateHome ? 'hidden' : ''}
          ${stateSchedule ? 'hidden' : ''}
          ${
            (stateSchedule || displayScheduleModal) && recipe.id === 1
              ? 'blur-[3px] pointer-events-none opacity-60'
              : ''
          }`}
        >
          <button
            type="button"
            className="hover:text-secondaryff transition-all bg-gray-700/50 rounded-full p-2"
            onClick={(event) => {
              event.preventDefault();
              if (!isLogged) {
                toggleSignUp();
              } else {
                handleAddFavori(event);
              }
            }}
          >
            {recipeFavori ? (
              <Heart size={20} fill="red" />
            ) : (
              <Heart size={20} />
            )}
          </button>
          <button
            type="button"
            className="hover:text-secondaryff transition-all bg-gray-700/50 rounded-full p-2"
            onClick={(event) => {
              event.preventDefault();
              if (!isLogged) {
                toggleSignUp();
              } else {
                handleAddSchedule(event);
              }
            }}
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Is there a recipe on this card? If yes, we display the delete function; otherwise, we display the shuffle function. */}
        {recipe.id !== 1 ? (
          <div
            className={`card-actions justify-end  ${
              stateHome ? 'hidden' : ''
            } ${stateSchedule ? '' : 'hidden'}     ${
              displayScheduleModal ? 'hidden' : ''
            }`}
          >
            {/* ----------- Function DELETE ----------- */}
            <button
              type="button"
              className="hover:text-secondaryff transition-all bg-gray-700/50 rounded-full p-2"
              onClick={(event) => {
                event.preventDefault();
                handleAddFavori(event);
              }}
            >
              {recipeFavori ? (
                <Heart size={20} fill="red" />
              ) : (
                <Heart size={20} />
              )}
            </button>
            <button
              type="button"
              className="hover:text-secondaryff transition-all bg-gray-700/50 rounded-full p-2"
              onClick={(event) => {
                event.preventDefault();
                handleDeleteMeal(event);
              }}
            >
              <X className="h-2 w-2 sm:h-4 sm:w-4 text-[rgb(255,0,0)]" />
            </button>
          </div>
        ) : (
          <div
            className={`card-actions justify-end  ${
              stateHome ? 'hidden' : ''
            } ${stateSchedule ? '' : 'hidden'}     ${
              displayScheduleModal ? 'hidden' : ''
            }`}
          >
            {/* ----------- Function SHUFFLE ----------- */}
            <button
              type="button"
              className="hover:text-secondaryff transition-all bg-gray-700/50 rounded-full p-2"
              onClick={(event) => {
                event.preventDefault();
                handleShuffleMeal(event);
              }}
            >
              <Shuffle className="h-2 w-2 sm:h-4 sm:w-4 text-[rgb(255,0,0)]" />
            </button>
          </div>
        )}
      </div>

      <div
        className={`rounded-b-lg foodPattern ${
          (stateSchedule || displayScheduleModal) && recipe.id === 1
            ? 'blur-[3px] pointer-events-none opacity-60'
            : ''
        }`}
      >
        <h2 className="text-white font-semibold p-2 text-center truncate text-sm sm:text-md">
          {recipe.name}
        </h2>
      </div>
    </Link>
  );
}

export default RecipeCard;
