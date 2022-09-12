import Table from "components/shared/Table";
import PageWrapper from "components/shared/PageWrapper";
import React from "react";

const View = () => {
    var data = [
        {
            id: "123",
            thumbnail: "https://i.ibb.co/WftX2Rk/89297527-p0.jpg",
            title: "Demo title",
            artist: "Mili",
            created: "2022-10-09",
            modified: "2022-10-12",
        },
        {
            id: "456",
            thumbnail: "https://i.ibb.co/WftX2Rk/89297527-p0.jpg",
            title: "Demo title",
            artist: "Mili",
            created: "2022-10-09",
            modified: "2022-10-12",
        },
        {
            id: "789",
            thumbnail: "https://i.ibb.co/WftX2Rk/89297527-p0.jpg",
            title: "Demo title",
            artist: "Mili",
            created: "2022-10-09",
            modified: "2022-10-12",
        },
    ];

    const [stateData, setStateData] = React.useState<any[]>([
        {
            id: data[0].id,
            thumbnail: (
                <div
                    style={{
                        backgroundImage: `url(${data[0].thumbnail})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        height: "35px",
                        width: "35px",
                        borderRadius: "50%",
                        border: "2px solid white",
                        minWidth: "35px",
                    }}
                />
            ),
            title: data[0].title,
            artist: data[0].artist,
            created: data[0].created,
            modified: data[0].modified,
        },
        {
            id: data[1].id,
            thumbnail: (
                <div
                    style={{
                        backgroundImage: `url(${data[1].thumbnail})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        height: "35px",
                        width: "35px",
                        borderRadius: "51%",
                        border: "2px solid white",
                        minWidth: "35px",
                    }}
                />
            ),
            title: data[1].title,
            artist: data[1].artist,
            created: data[1].created,
            modified: data[1].modified,
        },
    ]);

    const [isSelected, setIsSelected] = React.useState<boolean>(false);

    return (
        <PageWrapper className="bg-[#F0F0F5]">
            <Table
                className=""
                columns={[
                    "Thumbnail",
                    "Title",
                    "Artist",
                    "Created",
                    "Modified",
                ]}
                data={stateData}
                hasSelectOption={true}
                setDataState={setStateData}
                onRowClick={() => {
                    console.log("Clicked");
                }}
                setIsSelected={setIsSelected}
            />
        </PageWrapper>
    );
};

export default View;
