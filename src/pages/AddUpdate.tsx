import { useParams } from "react-router-dom"
import Input from "../components/Input"
import useFormValidation from "../hooks/useFormValidation"
import { useRef, useState } from "react"
import { useQueries } from "@tanstack/react-query"
import { getElementsByProjectId, getSquadsByProjectId, getStatusOptions } from "../services/selectorService"
import useErrorStore from "../store/useErrorStore"
import Select, { MultiValue, SingleValue } from "react-select"
import { reactSelectStyles } from "../utils/reactSelectStyles"
import { getElementsAndSquadsByProjectId } from "../services/projectService"

interface UpdateData {
    projectId: string,
    images?: Array<string>,
    title?: string,
    description?: string,
    elements?: Array<number>
    squads?: Array<number>
}

interface Option {
    id: number,
    label: string,
    value: number
}

interface ElementsAndSquads {
    elements: Array<Element>,
    squads: Array<Squad>
}

interface Element {
    id: number,
    name: string,
    lastUpdate: {
        date: string,
        timezone_type: string,
        timezone: string
    },
    status: string,
    statusId: number
}

interface Squad {
    id: number,
    name: string,
    lastUpdate: {
        date: string,
        timezone_type: string,
        timezone: string
    },
    amount: number,
    elements: Array<{
        amount: number,
        status: string,
        statusId: number
    }>
}

interface SelectedElement {
    id: number,
    status: number
}

const AddUpdate = () => {

    const { projectId } = useParams();
    const setError = useErrorStore((state) => state.setError);
    const initialUpdateData: UpdateData = {
        projectId: projectId!,
    };
    const [selectedElements, setSelectedElements] = useState<SelectedElement[]>([])


    const [{ data: elementOptions, error: errorElements },
        { data: squadOptions, error: errorSquads },
        { data: projectData, error: errorProject },
        { data: statusOptions, error: errorStatus }
    ] = useQueries({
        queries: [
            {
                queryKey: ['elementOptions'],
                queryFn: () => getElementsByProjectId(projectId!),
                enabled: !!projectId
            },
            {
                queryKey: ['squadOptions'],
                queryFn: () => getSquadsByProjectId(projectId!),
                enabled: !!projectId
            },
            {
                queryKey: ['projectData' + projectId],
                queryFn: () => getElementsAndSquadsByProjectId(projectId!),
                enabled: !!projectId
            },
            {
                queryKey: ['statusOptions'],
                queryFn: () => getStatusOptions()
            }
        ]
    }) as [{ data: Option[] | undefined, error: Error },
            { data: Option[] | undefined, error: Error },
            { data: ElementsAndSquads | undefined, error: Error },
            { data: Option[] | undefined, error: Error }]

    [errorElements, errorSquads, errorProject, errorStatus].map(error => {
        setError(error?.message);
    })

    let { formValues, handleInputChange, handleMultipleImagesDrop, handleDragOver, handleMultipleFilesSelect, handleDeleteImage, handleMultiSelectChange } = useFormValidation(initialUpdateData);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
            fileInputRef.current.value = "";
        }
    };

    const handleAddSelectedElements = (selectedOptions: MultiValue<{ value: number }>) => {
        const values = selectedOptions
            ? selectedOptions.map(option => ({
                id: option.value,
                status: projectData?.elements.find(element => element.id === option.value)!.statusId || 1
            })) : [];

        setSelectedElements(values);
    }

    const handleAddStatusToElement = (id: number) => (selectedOption: SingleValue<Option>) => {
        const value = selectedOption ? selectedOption.id : 1;

        setSelectedElements(prevElements =>
            prevElements.map(element =>
                element.id === id
                    ? { ...element, status: value } // Update the status of the matching element
                    : element // Keep other elements unchanged
            )
        );


    }

    return (
        <div className="text-offWhite flex flex-col ms-10 ml-10">
            <form>
                <div className="flex w-full justify-between">
                    <div className="w-1/3">
                        <Input
                            type="text"
                            name="title"
                            value={formValues.title || ""}
                            onChange={handleInputChange}
                        />

                        <div className="py-3">
                            <p className="font-display text-lightTeal uppercase font-light pb-1">Description</p>
                            <textarea
                                className="font-display text-offWhite bg-darkGrey h-60 resize-none rounded-md px-5 py-3 mb-2 w-full"
                                name="description"
                                value={formValues.description || ""}
                                onChange={handleInputChange}
                                maxLength={1000}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col w-2/5 me-10">
                        <p className="font-display text-lightTeal uppercase font-light">upload images</p>
                        <div
                            className="mt-4 p-6 border-dashed border-2 border-lightTeal rounded-lg cursor-pointer min-h-80 flex items-center justify-center text-lightTeal hover:border-solid relative"
                            onDrop={handleMultipleImagesDrop('images')}
                            onDragOver={handleDragOver}
                            onClick={handleClick}
                        >{formValues?.images && formValues.images.length > 0 ? (
                            <div>
                                <div onClick={(e) => handleDeleteImage(e, true)} className="absolute right-2 top-2 hover:text-offWhite">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 ">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                </div>
                                <div className="mt-4 grid grid-cols-4 gap-5">
                                    {formValues.images.map((image, index) => (
                                        <img key={index} src={image} alt="Preview" className="max-h-40 object-contain" />
                                    ))}

                                </div>
                            </div>

                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15" />
                            </svg>

                        )}
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleMultipleFilesSelect('images')}
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-y-3 mb-5">
                    <p className="font-display text-lightTeal font-light uppercase pb-1 text-xl">Choose elements to update</p>
                    <div className="flex gap-x-5 w-full px-5 items-center">
                        <div className="w-1/2">
                            <p className="font-display text-lightTeal font-light uppercase pb-1">Elements</p>
                            <Select
                                isMulti
                                closeMenuOnSelect={false}
                                options={elementOptions}
                                onChange={handleAddSelectedElements}
                                value={elementOptions?.filter(option => selectedElements.some(element => element.id === option.id))}
                                unstyled
                                classNames={reactSelectStyles}
                            />
                        </div>
                        <div className="w-1/2">
                            <p className="font-display text-lightTeal font-light uppercase pb-1">Squads</p>
                            <Select
                                isMulti
                                closeMenuOnSelect={false}
                                options={squadOptions}
                                onChange={handleMultiSelectChange('squads')}
                                value={squadOptions?.filter(option => formValues.squads?.includes(option.id))}
                                unstyled
                                classNames={reactSelectStyles}
                            />
                        </div>
                    </div>
                </div>
            </form>

            <div className="flex flex-col gap-y-5">
                {projectData?.elements.filter(option => selectedElements.some(element => element.id === option.id)).map((element, elementIndex) => (
                    <div key={elementIndex} className="w-1/2 flex items-center justify-between bg-darkGrey rounded-md p-5">
                        <div>{element.name}</div>
                        <div className="w-1/3">
                            <Select
                                options={statusOptions}
                                onChange={handleAddStatusToElement(element.id)}
                                value={statusOptions?.filter(option => option.id === selectedElements.find(selectedElement => selectedElement.id === element.id)?.status)}
                                unstyled
                                classNames={reactSelectStyles}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AddUpdate