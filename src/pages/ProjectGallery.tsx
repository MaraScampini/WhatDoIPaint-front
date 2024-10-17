import { useQuery } from "@tanstack/react-query"
import { getProjectGallery } from "../services/projectService"
import { useNavigate, useParams } from "react-router-dom"
import usePagination from "../hooks/usePagination"
import { useEffect, useState } from "react"
import useErrorStore from "../store/useErrorStore"
import Tag from "../components/Tag"
import Pagination from "../components/Pagination"

interface ProjectImages {
    total: number,
    data: Array<ImageInfo>
}

interface ImageInfo {
    url: string,
    date: string,
    updateId: number
}

const ProjectGallery = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();

    const [totalImages, setTotalImages] = useState(0);

    const setError = useErrorStore((state) => state.setError);
    const { currentPage, totalPages, goToPage, handleNextPage, handlePreviousPage } = usePagination(totalImages, 8);

    const { data: projectImages, error, refetch } = useQuery<ProjectImages>({
        queryKey: ['projectGallery'],
        queryFn: () => getProjectGallery(projectId!, { page: currentPage, limit: 8 })
    });

    if (error) setError(error.message);

    useEffect(() => {
        const setPaginationTotalImages = () => {
            projectImages && setTotalImages(projectImages.total);
        }

        setPaginationTotalImages();
    }, [projectImages])

    useEffect(() => {
        refetch();
    }, [currentPage])

    const handleGoToUpdate = (updateId: number) => {
        navigate(`/update/${updateId}`);
    }

    return (
        <div className="text-offWhite flex flex-col items-center justify-center">
            <div className="bg-darkGrey w-5/6 grid grid-cols-4 mb-5">
                {projectImages?.data.map((image, index) => (
                    <div key={index} className="p-2 flex justify-center items-center aspect-square relative inner-border hover:cursor-pointer rounded-md">
                        <div className="absolute top-3 right-3">
                            <Tag text={image.date} />
                        </div>
                        <div className="h-full w-full bg-cover rounded-md"
                            style={{ backgroundImage: `url(${image.url})` }}
                            onClick={() => handleGoToUpdate(image.updateId)}></div>
                    </div>
                ))}
            </div>
            <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 mt-10">
                <Pagination handleNextPage={handleNextPage} handlePreviousPage={handlePreviousPage} currentPage={currentPage} goToPage={goToPage} totalPages={totalPages} />
            </div>
        </div>
    )
}

export default ProjectGallery