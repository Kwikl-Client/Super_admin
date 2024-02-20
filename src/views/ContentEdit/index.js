import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import mammoth from 'mammoth';
import {
  Typography,
  Container,
  Paper,
  TextField,
  Button,
  IconButton,
  Input, Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Breadcrumb from 'component/Breadcrumb';
import { gridSpacing } from 'config.js';
import DeleteIcon from '@mui/icons-material/Delete';
import Modal from '@mui/material/Modal';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const ContentEdit = () => {
  const [showForm, setShowForm] = useState(true);
  const [heroData, setHeroData] = useState({});
  const [characterData, setCharacterData] = useState([]);
  const [overviewData, setOverviewData] = useState({});
  const [authorData, setAuthorData] = useState({});
  const [offerbarData, setOfferbarData] = useState({});
  const [chapterData, setChapterData] = useState([]);
  const [ultimateData, setUltimateData] = useState({});
  const [fomoAuthorData, setFomoAuthorData] = useState({});
  const [editedHeroData, setEditedHeroData] = useState({});
  const [editedCharacterData, setEditedCharacterData] = useState([]);
  const [editedOverviewData, setEditedOverviewData] = useState({});
  const [editedAuthorData, setEditedAuthorData] = useState({});
  const [editedOfferbarData, setEditedOfferbarData] = useState({});
  const [editedUltimateData, setEditedUltimateData] = useState({});
  const [editedFomoAuthorData, setEditedFomoAuthorData] = useState({});
  // const [editedChapterData, setEditedChapterData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chapNo, setChapNo] = useState(0);
  const [addedChapters, setAddedChapters] = useState([]);
  const [isBookEditing, setIsBookEditing] = useState(false);
  const [chapToBeDeleted, setChapToBeDeleted] = useState(null);
  const chapterRef = useRef(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const urls = [
          'http://localhost:7000/cms/getHero',
          'http://localhost:7000/cms/getCharacters',
          'http://localhost:7000/cms/getOverview',
          'http://localhost:7000/cms/getAuthor',
          'http://localhost:7000/cms/getOffer',
          'http://localhost:7000/cms/getUltimate',
          'http://localhost:7000/cms/getFomoAuthor',
          'http://localhost:7000/cms//getChapters',
        ];

        const responses = await Promise.all(urls.map(url => axios.get(url)));
        const [
          heroResponse,
          characterResponse,
          overviewResponse,
          authorResponse,
          offerResponse,
          ultimateResponse,
          fomoAuthorResponse,
          chapterResponse,
        ] = responses;

        setHeroData(heroResponse?.data?.data);
        setEditedHeroData(heroResponse?.data?.data);

        setCharacterData(characterResponse?.data?.data);
        setEditedCharacterData(characterResponse?.data?.data);

        setOverviewData(overviewResponse?.data?.data);
        setEditedOverviewData(overviewResponse?.data?.data);

        setAuthorData(authorResponse?.data?.data);
        setEditedAuthorData(authorResponse?.data?.data);

        setOfferbarData(offerResponse?.data?.data);
        setEditedOfferbarData(offerResponse?.data?.data);

        setChapterData(chapterResponse?.data?.data);
        // setEditedChapterData(chapterResponse?.data?.data);

        setUltimateData(ultimateResponse?.data?.data);
        setEditedUltimateData(ultimateResponse?.data?.data);

        setFomoAuthorData(fomoAuthorResponse?.data?.data);
        setEditedFomoAuthorData(fomoAuthorResponse?.data?.data);

        setIsLoading(false)

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleEditDetails = () => {
    setShowForm(true);
  };

  const handleInputChange = (e, section, id) => {
    const { name, value, files } = e.target;
    switch (section) {
      case 'hero':
        setEditedHeroData((prevData) => ({ ...prevData, [name]: value }));
        break;
      case 'characters':
        setEditedCharacterData((prevData) => {
          const updatedCharacters = prevData.map((character) =>
            character._id === id
              ? { ...character, [name]: files ? files[0] : value }
              : character
          );
          return updatedCharacters;
        });
        break;
      case 'author':
        setEditedAuthorData((prevData) => ({
          ...prevData,
          [name]: files ? files[0] : value,
        }));
        break;
      case 'overview':
        setEditedOverviewData((prevData) => {
          const updatedCards = prevData.cards.map((card) => {
            if (card._id === id) {
              return { ...card, [e.target.name]: e.target.value };
            }
            return card;
          });
          return { ...prevData, cards: updatedCards, [name]: files ? files[0] : value };
        });
        break;
      case 'offerbar':
        setEditedOfferbarData((prevData) => ({ ...prevData, [name]: value }));
        break;
      case 'fomoAuthor':
        setEditedFomoAuthorData((prevData) => ({
          ...prevData,
          [name]: files ? files[0] : value,
        }));
        break;
      case 'ultimate':
        setEditedUltimateData((prevData) => ({ ...prevData, [name]: value }));
        break;
      case 'book':
        setAddedChapters((prevData) => {
          const updatedChapters = [...prevData];
          updatedChapters[id][name] = e.book ? e.book : value;
          return updatedChapters;
        });
        break;
      default:
        break;
    }
  };

  const handleFormSubmit = async (url, data, setDefaultData, setEditedData) => {
    try {
      setIsLoading(true)
      const response = await axios.patch(url, data);
      setDefaultData(response?.data?.data);
      setEditedData(response?.data?.data);
      window.alert(response.data.message);
    }
    catch (error) {
      console.error('Error updating data:', error);
      window.alert(`Problem editing data`);
    }
    finally {
      setIsLoading(false)
    }
  };

  const handleCharacterSubmit = async (e, ind) => {
    e.preventDefault();
    setIsLoading(true)
    const formData = new FormData();
    formData.append('characterName', editedCharacterData[ind].characterName);
    formData.append('shortDescription', editedCharacterData[ind].shortDescription);
    formData.append('briefDescription', editedCharacterData[ind].briefDescription);
    formData.append('image', editedCharacterData[ind].image);
    try {
      const response = await axios.patch(`http://localhost:7000/cms/editCharacters/${editedCharacterData[ind]._id}`, formData,
        { headers: { 'Content-Type': 'multipart/form-data' } });
      const temp = [...editedCharacterData]
      temp[ind] = response.data.data;
      setCharacterData(temp);
      setEditedCharacterData(temp);
      window.alert("Character data Edited successfully")
    }
    catch (error) {
      setEditedCharacterData(characterData);
      console.error('Error updating data1:', error);
      window.alert("Problem editing Character data")
    }
    finally {
      setIsLoading(false)
    }
  }

  const handleFomoAuthorSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append('name', editedFomoAuthorData.name);
    formData.append('shortDescription', editedFomoAuthorData.shortDescription);
    formData.append('briefDescription', editedFomoAuthorData.briefDescription);
    formData.append('image', editedFomoAuthorData.image);
    try {
      const response = await axios.patch('http://localhost:7000/cms/editfomoAuthor', formData,
        { headers: { 'Content-Type': 'multipart/form-data' } });
      setFomoAuthorData(response?.data?.data); setEditedFomoAuthorData(response?.data?.data);
      window.alert("Fomo author data Edited successfully")
    }
    catch (error) {
      setEditedFomoAuthorData(authorData);
      console.error('Error updating data1:', error);
      window.alert("Problem editing fomo Author data")
    }
    finally {
      setIsLoading(false)
    }
  }

  const handleAuthorSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append('name', editedAuthorData.name);
    formData.append('shortDescription', editedAuthorData.shortDescription);
    formData.append('briefDescription', editedAuthorData.briefDescription);
    formData.append('image', editedAuthorData.image);
    try {
      const response = await axios.patch('http://localhost:7000/cms/editAuthor', formData,
        { headers: { 'Content-Type': 'multipart/form-data' } });
      setAuthorData(response?.data?.data); setEditedAuthorData(response?.data?.data);
      window.alert("Author data Edited successfully")
    }
    catch (error) {
      setEditedAuthorData(authorData);
      console.error('Error updating data1:', error);
      window.alert("Problem editing Author data")
    }
    finally {
      setIsLoading(false)
    }
  }

  const handleOverviewSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append('overallTitle', editedOverviewData.overallTitle);
    formData.append('cards', JSON.stringify(editedOverviewData.cards));
    formData.append('image', editedOverviewData.image);
    try {
      console.log(formData)
      const response = await axios.patch('http://localhost:7000/cms/editOverview', formData,
        { headers: { 'Content-Type': 'multipart/form-data' } });
      setOverviewData(response?.data?.data);
      setEditedOverviewData(response?.data?.data);
      window.alert("Overview data Edited successfully")
    }
    catch (error) {
      setEditedOverviewData(overviewData);
      console.error('Error updating data1:', error);
      window.alert("Problem editing overview data")
    }
    finally {
      setIsLoading(false)
    }
  }

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:7000/cms/insertChapter', addedChapters);
      setAddedChapters([]);
      setIsBookEditing(false);
      setChapterData(response?.data?.data);
      window.alert("Chapters uploaded successfully");
    }
    catch (error) {
      console.error('Error updating data1:', error);
      window.alert("Problem uploading book");
    }
    finally {
      setIsLoading(false)
    }
  }
  const handleSubmitSection = (event, section, ind) => {
    event.preventDefault();
    switch (section) {
      case 'hero':
        handleFormSubmit('http://localhost:7000/cms/editHero', editedHeroData, setHeroData, setEditedHeroData);
        break;
      case 'characters':
        handleCharacterSubmit(event, ind);
        break;
      case 'overview':
        handleOverviewSubmit(event);
        break;
      case 'author':
        handleAuthorSubmit(event);
        break;
      case 'offerbar':
        handleFormSubmit('http://localhost:7000/cms/editOffer', editedOfferbarData, setOfferbarData, setEditedOfferbarData);
        break;
      case 'fomoAuthor':
        handleFomoAuthorSubmit(event);
        break;
      case 'ultimate':
        handleFormSubmit('http://localhost:7000/cms/editUltimate', editedUltimateData, setUltimateData, setEditedUltimateData);
        break;
      case 'book':
        handleBookSubmit(event);
        break;
      default:
        break;
    }
  };

  const handleCancelEdit = (section) => {
    switch (section) {
      case 'hero':
        setEditedHeroData(heroData);
        break;
      case 'characters':
        setEditedCharacterData(characterData);
        break;
      case 'overview':
        setEditedOverviewData(overviewData);
        break;
      case 'author':
        setEditedAuthorData(authorData);
        break;
      case 'fomoAuthor':
        setFomoAuthorData(fomoAuthorData);
        break;
      case 'offerbar':
        setEditedOfferbarData(offerbarData);
        break;
      case 'ultimate':
        setEditedUltimateData(ultimateData);
        break;
      case 'book':
        setAddedChapters([]);
        setIsBookEditing(false);
        setChapNo(0)
        break;
      default:
        break;
    }
  };

  const renderButton = (label, color, onClick) => {
    return (
      <Button variant="contained" color={color} onClick={onClick}>
        {label}
      </Button>
    )
  };

  const renderEditButton = () => (
    <IconButton color="primary" onClick={handleEditDetails}>
      <EditIcon />
    </IconButton>
  );

  const renderSaveCancelButtons = (section, ind) => (
    <>
      {renderButton(`Save ${section} Section`, 'primary', (e) => handleSubmitSection(e, section, ind))}
      {renderButton('Cancel Edit', 'secondary', () => handleCancelEdit(section))}
    </>
  );

  const renderSection = (title, data, section, ind, inputs) => (
    <div>
      <Typography variant="h5">{title}</Typography>
      {data && (
        <form>
          {inputs}
          <div>{showForm ? renderSaveCancelButtons(section, ind) : renderEditButton()}</div>
        </form>
      )}
    </div>
  );

  const renderBookSection = (title, data, section, ind, inputs, extras) => (
    <div>
      <Typography variant="h5">{title}</Typography>
      {extras}
      <Typography variant="h6">Add new chapters:</Typography>
      {data && (
        <form>
          {inputs}
          <div>{showForm ? renderSaveCancelButtons(section, ind) : renderEditButton()}</div>
        </form>
      )}
    </div>
  );

  const formattedDate = (date) => { return new Date(date).toISOString().split('T')[0]; };

  const parseFile = (event, id) => {
    const file = event.target.files[0];

    const reader = new FileReader();

    reader.onload = async () => {
      const buffer = reader.result;
      const result = await mammoth.extractRawText({ arrayBuffer: buffer })
      const arrdChapter = result.value.split(" ");
      const maxWordsPerPage = 203;
      const parsedChapter = [];

      for (let i = 0; i < arrdChapter.length; i += maxWordsPerPage)
        parsedChapter.push(arrdChapter.slice(i, i + maxWordsPerPage).join(' '));

      event.book = parsedChapter;
      handleInputChange(event, "book", id);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleShowChapterInput = () => {
    setAddedChapters(Array.from({ length: chapNo }, () => { return { chapterName: "", content: [] } }));
    setIsBookEditing(false)
    setChapNo(0)
  }

  const isBookAddChapBtnInactive = chapNo == 0

  const handleChapterEdit = () => {
    setIsBookEditing(true);
    setAddedChapters([]);
    if (chapterRef.current) {
      chapterRef.current.focus();
    }
  }
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const handleDeleteChapter =async()=>{
    setIsLoading(true);
    try {
      const response = await axios.delete(`http://localhost:7000/cms/deleteChapters/${chapToBeDeleted._id}`);
      setChapterData(response?.data?.data);
      setChapToBeDeleted(null)
      window.alert(`${chapToBeDeleted.chapterName} deleted successfully`);
    }
    catch (error) {
      console.error(error);
      window.alert("Problem deleting the chapter")
    }
    finally{
      setIsLoading(false);
      setOpenDeleteModal(false);
    }
  }
  return (
    <>
      <Breadcrumb parent="CMS" title="Edit Content" />
      {isLoading ? <h1>Loading...</h1> :
        <Container maxWidth="lg" className="dashboard">
          <Paper elevation={gridSpacing}>
            <div>
              {renderSection('Hero Section', editedHeroData, 'hero', 0, (
                <>
                  <TextField
                    value={editedHeroData.titleText}
                    label="Hero Title"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    name="titleText"
                    onChange={(e) => handleInputChange(e, 'hero')}
                    required
                  />
                  <TextField
                    value={editedHeroData.shortDescription}
                    label="Hero Description"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={2}
                    margin="dense"
                    name="shortDescription"
                    onChange={(e) => handleInputChange(e, 'hero')}
                    required
                  />
                  <TextField
                    label="Original Price"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    name="originalPrice"
                    value={editedHeroData.originalPrice}
                    onChange={(e) => handleInputChange(e, 'hero')}
                    required
                  />
                  <TextField
                    label="Offer Price"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    name="offerPrice"
                    value={editedHeroData.offerPrice}
                    onChange={(e) => handleInputChange(e, 'hero')}
                    required
                  />
                </>
              ))}
              <br />
              {editedCharacterData.map((character, ind) => {
                return (
                  renderSection(`Character Section ${ind + 1}`, characterData, 'characters', ind, (
                    <>
                      <TextField
                        label={`Character Name`}
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        name="characterName"
                        value={character.characterName}
                        onChange={(e) => handleInputChange(e, 'characters', character._id)}
                      />
                      <TextField
                        label={`Short Description`}
                        variant="outlined"
                        fullWidth
                        rows={4}
                        margin="dense"
                        name="shortDescription"
                        value={character.shortDescription}
                        onChange={(e) => handleInputChange(e, 'characters', character._id)}
                      />
                      <TextField
                        label={`Brief Description`}
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                        margin="dense"
                        name="briefDescription"
                        value={character.briefDescription}
                        onChange={(e) => handleInputChange(e, 'characters', character._id)}
                      />
                      <Input
                        type="file"
                        variant="standard"
                        fullWidth
                        name="image"
                        onChange={(e) => handleInputChange(e, 'characters', character._id)}
                        disableUnderline={true}
                        id={`characterForm${ind}`}
                      />
                      <a href={character.image} target="_blank" rel="noreferrer">View Image</a>
                    </>

                  ))
                )
              })}
              <br />
              {renderSection('Overview Section', editedOverviewData, 'overview', 0, (
                <>
                  <TextField
                    label={`Card Title`}
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    name="overallTitle"
                    value={editedOverviewData.overallTitle}
                    onChange={(e) => handleInputChange(e, 'overview')}
                  />
                  <Input
                    type="file"
                    fullWidth
                    margin="dense"
                    name="image"
                    disableUnderline={true}
                    onChange={(e) => handleInputChange(e, 'overview')}
                  />
                  <a href={editedOverviewData.image} target="_blank" rel="noreferrer">View Image</a>
                  {editedOverviewData.cards && editedOverviewData.cards.map((card, ind) => (
                    <div key={card._id}>
                      <TextField
                        label={`Subtitle Title ${ind + 1}`}
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        name="subTitle"
                        value={card.subTitle}
                        onChange={(e) => handleInputChange(e, 'overview', card._id)}
                      />

                      <TextField
                        label={`Brief Description ${ind + 1}`}
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={2}
                        margin="dense"
                        name="briefDescription"
                        value={card.briefDescription}
                        onChange={(e) => handleInputChange(e, 'overview', card._id)}
                      />
                    </div>
                  ))}

                </>
              ))}
              <br />
              {renderSection('Author Section', authorData, 'author', 0, (
                <>
                  <TextField
                    label="Author Name"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    name="name"
                    value={editedAuthorData.name}
                    onChange={(e) => handleInputChange(e, 'author')}
                  />
                  <TextField
                    label={`Short Description`}
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    name="shortDescription"
                    value={editedAuthorData.shortDescription}
                    onChange={(e) => handleInputChange(e, 'author')}
                  />
                  <TextField
                    label={`Brief Description`}
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={2}
                    margin="dense"
                    name="briefDescription"
                    value={editedAuthorData.briefDescription}
                    onChange={(e) => handleInputChange(e, 'author')}
                  />

                  <Input
                    type="file"
                    fullWidth
                    margin="dense"
                    name="image"
                    disableUnderline={true}
                    onChange={(e) => handleInputChange(e, 'author')}
                  />
                  <a href={editedAuthorData.image} target="_blank" rel="noreferrer">View Image</a>
                </>
              ))}
              <br />
              {renderSection('Offerbar Section', offerbarData, 'offerbar', 0, (
                <>
                  <TextField
                    type="date"
                    label="Offer Date"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    name="cutoffDate"
                    value={formattedDate(editedOfferbarData.cutoffDate)}
                    onChange={(e) => handleInputChange(e, 'offerbar')}
                  />
                  <TextField
                    label="Price"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    name="price"
                    value={editedOfferbarData?.price}
                    onChange={(e) => handleInputChange(e, 'offerbar')}
                  />
                </>
              ))}
              <br />
              {renderSection('Fomo Section', fomoAuthorData, 'fomoAuthor', 0, (
                <>
                  <TextField
                    label="Author Name"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    name="name"
                    value={editedFomoAuthorData.name}
                    onChange={(e) => handleInputChange(e, 'fomoAuthor')}
                  />
                  <TextField
                    label={`Short Description`}
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    name="shortDescription"
                    value={editedFomoAuthorData.shortDescription}
                    onChange={(e) => handleInputChange(e, 'fomoAuthor')}
                  />
                  <TextField
                    label={`Brief Description`}
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={2}
                    margin="dense"
                    name="briefDescription"
                    value={editedFomoAuthorData.briefDescription}
                    onChange={(e) => handleInputChange(e, 'fomoAuthor')}
                  />

                  <Input
                    type="file"
                    fullWidth
                    margin="dense"
                    name="image"
                    disableUnderline={true}
                    onChange={(e) => handleInputChange(e, 'fomoAuthor')}
                  />
                  <a href={editedFomoAuthorData.image} target="_blank" rel="noreferrer">View Image</a>
                </>
              ))}
              <br />
              {renderSection('Ultimate Section', editedUltimateData, 'ultimate', 0, (
                <>
                  <TextField
                    value={editedUltimateData.titleText}
                    label="Hero Title"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    name="titleText"
                    onChange={(e) => handleInputChange(e, 'ultimate')}
                    required
                  />
                  <TextField
                    value={editedUltimateData.shortDescription}
                    label="Hero Description"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={2}
                    margin="dense"
                    name="shortDescription"
                    onChange={(e) => handleInputChange(e, 'ultimate')}
                    required
                  />
                  <TextField
                    label="Original Price"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    name="originalPrice"
                    value={editedUltimateData.originalPrice}
                    onChange={(e) => handleInputChange(e, 'ultimate')}
                    required
                  />
                  <TextField
                    label="Offer Price"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    name="offerPrice"
                    value={editedUltimateData.offerPrice}
                    onChange={(e) => handleInputChange(e, 'ultimate')}
                    required
                  />
                </>
              ))}
              <br />
              {renderBookSection('Book Section', true, 'book', 0, (
                <>
                  <div style={{ display: 'flex', gap: 20, alignItems: "center" }}>
                    <TextField
                      type='number'
                      label="Enter No. of Chapters"
                      variant="outlined"
                      margin="dense"
                      value={chapNo}
                      disabled={!isBookEditing}
                      onChange={(e) => setChapNo(e.target.value)}
                      inputRef={chapterRef}
                    />
                    <Button variant="contained" color="primary" onClick={handleShowChapterInput} disabled={isBookAddChapBtnInactive}>
                      Confirm
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleChapterEdit}>Change</Button>
                  </div>
                  {addedChapters.length > 0 && addedChapters.map((item, ind) => (
                    <div style={{ display: 'flex', gap: 20, alignItems: "center" }} key={ind}>
                      <TextField
                        label="Chapter Name"
                        variant="outlined"
                        margin="dense"
                        name="chapterName"
                        defaultValue={item.chapterName}
                        onChange={(e) => handleInputChange(e, 'book', ind)}
                      />
                      <Input
                        type="file"
                        fullWidth
                        margin="dense"
                        name="content"
                        disableUnderline={true}
                        onChange={(e) => parseFile(e, ind)}
                      />
                    </div>))}

                </>
              ), (<>
                <Typography variant="h6">Added Chapters:</Typography>
                <div style={{ display: "flex", gap: 25 }}>
                  {chapterData.map((chap)=>(
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }} key={chap._id}>
                      <div>{chap.chapterName}</div> <DeleteIcon onClick={()=>{setOpenDeleteModal(true); setChapToBeDeleted(chap)}} />
                    </div>
                  ))}
                </div>
              </>))}
            </div>

          </Paper>
        </Container>}
      <Modal open={openDeleteModal} onClose={()=>setOpenDeleteModal(false)} >
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2">
            {`Are you sure wanted to delete ${chapToBeDeleted?.chapterName}?`}
          </Typography>
          <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleDeleteChapter}>Yes</Button>
          <Button variant="contained" color="secondary" sx={{ ml: 2, mt: 2 }} onClick={()=>{setOpenDeleteModal(false);setChapToBeDeleted(null)}}>No</Button>
          {/* <Typography sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography> */}
        </Box>
      </Modal>
    </>
  );
};

export default ContentEdit;
