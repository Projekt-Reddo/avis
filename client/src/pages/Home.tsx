import Table from "components/shared/Table";
import PageWrapper from "components/shared/PageWrapper";
import React from "react";

const Home = () => {
    var data = [
        {
            id: "123",
            thumbnail: "https://i.ibb.co/WftX2Rk/89297527-p0.jpg",
            title: "Demo title 1",
            artist: "Mili",
            created: "2022-10-09",
            modified: "2022-10-12",
        },
        {
            id: "456",
            thumbnail: "https://i.ibb.co/WftX2Rk/89297527-p0.jpg",
            title: "Demo title 2",
            artist: "Mili",
            created: "2022-10-09",
            modified: "2022-10-12",
        },
        {
            id: "789",
            thumbnail: "https://i.ibb.co/WftX2Rk/89297527-p0.jpg",
            title: "Demo title 3",
            artist: "Mili",
            created: "2022-10-09",
            modified: "2022-10-12",
        },
        {
            id: "abc",
            thumbnail: "https://i.ibb.co/WftX2Rk/89297527-p0.jpg",
            title: "Demo title 4",
            artist: "Mili",
            created: "2022-10-09",
            modified: "2022-10-12",
        },
        {
            id: "def",
            thumbnail: "https://i.ibb.co/WftX2Rk/89297527-p0.jpg",
            title: "Demo title 5",
            artist: "Mili",
            created: "2022-10-09",
            modified: "2022-10-12",
        },
        {
            id: "ghi",
            thumbnail: "https://i.ibb.co/WftX2Rk/89297527-p0.jpg",
            title: "Demo title 6",
            artist: "Mili",
            created: "2022-10-09",
            modified: "2022-10-12",
        },
        {
            id: "jkl",
            thumbnail: "https://i.ibb.co/WftX2Rk/89297527-p0.jpg",
            title: "Demo title 7",
            artist: "Mili",
            created: "2022-10-09",
            modified: "2022-10-12",
        },
        {
            id: "mno",
            thumbnail: "https://i.ibb.co/WftX2Rk/89297527-p0.jpg",
            title: "Demo title 8",
            artist: "Mili",
            created: "2022-10-09",
            modified: "2022-10-12",
        },
        {
            id: "pqr",
            thumbnail: "https://i.ibb.co/WftX2Rk/89297527-p0.jpg",
            title: "Demo title 9",
            artist: "Mili",
            created: "2022-10-09",
            modified: "2022-10-12",
        },
        {
            id: "stu",
            thumbnail: "https://i.ibb.co/WftX2Rk/89297527-p0.jpg",
            title: "Demo title 10",
            artist: "Mili",
            created: "2022-10-09",
            modified: "2022-10-12",
        },
        {
            id: "vwx",
            thumbnail: "https://i.ibb.co/WftX2Rk/89297527-p0.jpg",
            title: "Demo title 11",
            artist: "Mili",
            created: "2022-10-09",
            modified: "2022-10-12",
        },
    ];

    const [stateData, setStateData] = React.useState<any[]>(
        data.map((item) => ({
            id: item.id,
            thumbnail: (
                <div
                    style={{
                        backgroundImage: `url(${item.thumbnail})`,
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
            title: item.title,
            artist: item.artist,
            created: item.created,
            modified: item.modified,
        }))
    );

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

export default Home;
