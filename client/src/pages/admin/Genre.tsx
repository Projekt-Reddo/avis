import { yupResolver } from "@hookform/resolvers/yup";
import { useModal } from "components/Modal";
import Modal from "components/Modal/Modal";
import PageWrapperWithLeftNav from "components/PageWrapper/PageWrapperWithLeftNav";
import Icon from "components/shared/Icon";
import Loading from "components/shared/Loading";
import TextArea from "components/shared/TextArea";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { createAsync, deleteAsync, viewAsync } from "store/slices/genreSlice";
import { useAppDispatch, useAppSelector } from "utils/react-redux-hooks";
import yup from "utils/yup-config";

interface ModalData {
    type: "error" | "info" | "warning";
    title: string;
    message: string;
    confirmTitle: string;
    modalBody?: any;
    onConfirm: () => void;
}

const Genre = () => {
    const dispatch = useAppDispatch();
    const genreState = useAppSelector((state) => state.genre);
    const { open: openModal, setOpen: setOpenModal } = useModal();
    const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
    const {
        register,
        getValues,
        setValue,
        formState: { errors },
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        dispatch(viewAsync());
    }, []);

    const modalCreateInit: ModalData = {
        type: "info",
        title: "Create new genres",
        message: "Enter a comma after each genre",
        modalBody: (
            <TextArea
                register={register("genres")}
                error={errors.title}
                className={"w-full"}
            />
        ),
        confirmTitle: "Create",
        onConfirm: () => {
            var genresStr = getValues("genres");
            if (!genresStr) {
                return;
            }

            var genres = genresStr.split(",");
            var genres = genres.map((genre: string) =>
                genre.replace(/\s+/g, " ").trim()
            );

            setValue("genres", "");
            dispatch(createAsync(genres));
        },
    };

    const modalDeleteInit: ModalData = {
        type: "error",
        title: "Delete genres",
        message:
            "Data will be permanently removed. This action cannot be undone",
        modalBody: (
            <div
                className={
                    "flex flex-row flex-wrap gap-3 w-[20rem] lg:w-[25rem] mb-2"
                }
            >
                {selectedGenres.map((genre) => (
                    <span
                        key={genre.id + "delete"}
                        className="bg-red-100 text-red-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-900"
                    >
                        {genre.name}
                    </span>
                ))}
            </div>
        ),
        confirmTitle: "Delete",
        onConfirm: () => {
            dispatch(deleteAsync(selectedGenres.map((genre) => genre.id)));
            setSelectedGenres([]);
        },
    };
    const [modalData, setModalData] = useState<ModalData>(modalCreateInit);

    //#region Delete genre

    const isSelectedGenre = (genre: Genre) => {
        var existed = selectedGenres.filter((x) => x.id === genre.id);
        return Array.isArray(existed) && existed.length ? true : false;
    };
    const selectedGenre = (genre: Genre) => {
        if (isSelectedGenre(genre)) {
            setSelectedGenres(selectedGenres.filter((x) => x.id !== genre.id));
        } else {
            setSelectedGenres([...selectedGenres, genre]);
        }
    };
    const openDeleteModal = () => {
        setModalData(modalDeleteInit);
        setOpenModal(true);
    };

    //#endregion

    //#region Create genre

    const openCreateModal = () => {
        setModalData(modalCreateInit);
        setOpenModal(true);
    };

    //#endregion

    return (
        <PageWrapperWithLeftNav className="bg-[#F0F0F5]">
            <div className="px-3 lg:px-0">
                <div className="flex justify-between pt-6">
                    <div className="text-lg font-bold">Genre</div>
                    <div className="flex flex-row gap-4">
                        <button
                            className="h-9 w-9 flex justify-center items-center text-[color:var(--teal-lighter-color)] bg-[color:var(--body-bg-color)]"
                            style={{
                                borderRadius: "50%",
                                border: "3px solid var(--teal-lighter-color)",
                            }}
                            onClick={openCreateModal}
                        >
                            <Icon icon="plus" />
                        </button>

                        <button
                            type="button"
                            className={`h-9 w-9 flex justify-center items-center text-[color:var(--red-lighter-color)] bg-[color:var(--body-bg-color)] disabled:opacity-60`}
                            style={{
                                borderRadius: "50%",
                                border: "3px solid var(--red-lighter-color)",
                            }}
                            disabled={selectedGenres.length > 0 ? false : true}
                            onClick={openDeleteModal}
                        >
                            <Icon icon="trash" />
                        </button>
                    </div>
                </div>

                {genreState && genreState.status !== "idle" ? (
                    <div className="flex justify-center items-center w-full h-full">
                        <Loading />
                    </div>
                ) : (
                    <div className="flex flex-row flex-wrap w-full gap-3 mt-5">
                        {genreState.data.map((genre: Genre) => (
                            <span
                                key={genre.id}
                                className={`inline-flex items-center py-1 px-2 mr-2 text-sm font-medium rounded ${
                                    isSelectedGenre(genre)
                                        ? "text-red-800 bg-red-200"
                                        : "text-teal-800 bg-teal-200"
                                }`}
                            >
                                {genre.name}

                                <button
                                    type="button"
                                    className={`inline-flex items-center p-0.5 ml-2 text-sm bg-transparent rounded-sm ${
                                        isSelectedGenre(genre)
                                            ? "text-red-400 hover:bg-red-200 hover:text-red-900 dark:hover:bg-red-300 dark:hover:text-red-900"
                                            : "text-teal-400 hover:bg-teal-200 hover:text-teal-900 dark:hover:bg-teal-300 dark:hover:text-teal-900"
                                    }`}
                                    aria-label="Remove"
                                    onClick={() => {
                                        selectedGenre(genre);
                                    }}
                                >
                                    <svg
                                        aria-hidden="true"
                                        className="w-3.5 h-3.5"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path>
                                    </svg>
                                    <span className="sr-only">
                                        Remove badge
                                    </span>
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <Modal
                type={modalData.type}
                open={openModal}
                setOpen={setOpenModal}
                title={modalData.title}
                message={modalData.message}
                modalBody={modalData.modalBody}
                confirmTitle={modalData.confirmTitle}
                onConfirm={modalData.onConfirm}
            />
        </PageWrapperWithLeftNav>
    );
};

export default Genre;

const schema = yup.object().shape({
    genres: yup.string().required(),
});
