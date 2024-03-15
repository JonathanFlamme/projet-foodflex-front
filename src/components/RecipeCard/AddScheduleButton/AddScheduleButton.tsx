import { Plus } from 'react-feather';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import {
  addScheduleFavori,
  displaySchedule,
  toggleIsOpen,
  toggleSignUpOpen,
} from '../../../store/reducers/user';
import { Recipe } from '../../../@types/recipe';

interface AddScheduleButtonProps {
  recipe: Recipe;
}

function AddScheduleButton({ recipe }: AddScheduleButtonProps) {
  const isLogged = useAppSelector((state) => state.settings.isLogged);
  const clickAddFavori = useAppSelector(
    (state) => state.settings.clickAddSchedule
  );

  const dispatch = useAppDispatch();

  // Function to toggle the SignUp modal and the AddSchedule modal
  const toggleSignUp = () => {
    dispatch(toggleSignUpOpen());
    dispatch(toggleIsOpen());
  };

  // Function to handle adding the recipe to the schedule
  function handleAddSchedule(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    dispatch(displaySchedule(!clickAddFavori));
    dispatch(addScheduleFavori(recipe));

    // Scroll to the top of the page
    window.scrollTo({
      behavior: 'smooth',
      top: 0,
    });
  }
  return (
    <button
      type="button"
      className="hover:text-secondaryff transition-all bg-gray-700/50 rounded-full p-2 transform hover:rotate-90 duration-300"
      onClick={(event) => {
        event.preventDefault();
        // If the user is not logged in, toggle the SignUp modal
        // Otherwise, handle adding the recipe to the schedule
        if (!isLogged) {
          toggleSignUp();
        } else {
          handleAddSchedule(event);
        }
      }}
    >
      <Plus size={20} />
    </button>
  );
}
export default AddScheduleButton;
