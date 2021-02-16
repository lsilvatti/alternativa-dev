import React, { useEffect, useState } from 'react';
import { Button, Container, Divider, Fab, IconButton, makeStyles, Typography } from '@material-ui/core';
import { Table, TableBody, TableCell, TableHead, TableRow, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@material-ui/core';
import {Delete, Edit, Add, BorderAllRounded} from '@material-ui/icons';
import { getProduct, getCategory, postCategory, deleteCategory, putCategory } from '../services/api';
import {Product, Category} from "../services/interfaces"
import '../scss/form.scss';


export default function Produtos() {


    const defaultCategory: Category = {
        id: null,
        name: '',
        description: '',
    }

    useEffect(() => {
        getProducts();
        populateCategoryList();
    }, [])

    const useStyles = makeStyles(theme =>({
        textField:{
            marginTop: 20,
            marginBottom: 20
        },
        mainContainer:{
            position: 'relative',
            top: 60,
            padding: 70,
            borderRadius: 16,
            backgroundColor: '#F5F5F5'
        },
        divider: {
            marginBottom:30
        },
        button: {
            margin: theme.spacing(1),
          },
          headerSection: {
              display: 'flex',
              justifyContent: 'space-between',
          }
    }));

    const classes = useStyles();
    const [categoryList, setCategoryList] = useState<Category[]>([]);
    const [editModalState, setEditModalState] = useState(false);
    const [deleteModalState, setDeleteModalState] = useState(false);
    const [warningModalState, setWarningModalState] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category>();
    const [editValues, setEditValues] = useState<Category>();
    const [productList, setProductList] = useState<Product[]>([]);

    const handleOpenEdit = (selected: number) => { setEditModalState(true); setSelectedCategory(categoryList[selected]); setEditValues(categoryList[selected]); }
    const handleCloseEdit = () => { setEditModalState(false) };

    const handleOpenDelete = (selected: number) => { setDeleteModalState(true); setSelectedCategory(categoryList[selected]); }
    const handleCloseDelete = () => { setDeleteModalState(false) }
    const handleCloseWarning = () => { setWarningModalState(false) }

    const handleOpenAdd = () => { 
        setEditModalState(true); 
        setSelectedCategory(undefined); 
        setEditValues(defaultCategory);
    }

    function populateCategoryList(){
        getCategory().then(result => setCategoryList(result));
    }

    function getProducts(){
        getProduct().then(result => setProductList(result));
    }

    function delVerification(categoryID:number){
        const canDelete:boolean = Boolean(productList.find(value => value.categoryId == categoryID));
        return !canDelete;
    }


    const changeEditFieldsHandle = (event: React.ChangeEvent<HTMLInputElement>) => {
        let newEditValues: any = { ...editValues };
        newEditValues[event.target.name] = event.target.value;
        setEditValues(newEditValues);
        console.log(event.target.value);
        console.log(JSON.stringify(editValues));
    };

    function del(selected: number) {
        if (delVerification(selected)){
            deleteCategory(selected).then(res => populateCategoryList());
        }
        else{
            setWarningModalState(true);
        }
        
        if (deleteModalState) {
            setDeleteModalState(false);
        }
    }

    function modify(){
        if(selectedCategory){
            putCategory(editValues).then(res =>  populateCategoryList());
            setEditModalState(false);
        }
        else{       
            postCategory(editValues).then(res =>  populateCategoryList());
            setEditModalState(false);
        }
    }



    return (
        <Container className={classes.mainContainer} maxWidth="xl">
            <div className={classes.headerSection}> <Typography variant="h4" gutterBottom>Categorias</Typography>
            <Button
        variant="contained"
        color="primary"
        size="large"
        className={classes.button}
        startIcon={<Add />}
        onClick={() => handleOpenAdd()}
      >
       Adicionar Categoria
      </Button></div>
           
            <Divider className={classes.divider} />
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell align="center">ID</TableCell>
                        <TableCell align="center">Nome</TableCell>
                        <TableCell align="center">Descrição</TableCell>
                        <TableCell align="center">Ações</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {categoryList.map((row, index) => (
                        <TableRow key={row.id}>
                            <TableCell align="center">{row.id}</TableCell>
                            <TableCell align="center">{row.name}</TableCell>
                            <TableCell align="center">{row.description}</TableCell>
                            <TableCell align="center">
                            <IconButton color="primary" onClick={() => handleOpenEdit(index)} aria-label="Editar" component="span"><Edit /></IconButton>
                            <IconButton color="secondary" onClick={() => handleOpenDelete(index)} aria-label="Deletar" component="span"><Delete /></IconButton>
                                </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Dialog fullWidth maxWidth="sm" open={editModalState} onClose={handleCloseEdit}>
                <DialogTitle id="form-dialog-title">{selectedCategory ? `Editar ${selectedCategory.name}` : 'Adicionar uma nova categoria'}</DialogTitle>
                <DialogContent>
                    <TextField
                        className={classes.textField}
                        fullWidth
                        onChange={changeEditFieldsHandle}
                        name="name"
                        label="Nome"
                        value={editValues ? editValues.name : ''}
                        type="text"
                        variant="outlined"
                    />

                    <TextField
                        className={classes.textField}
                        fullWidth
                        onChange={changeEditFieldsHandle}
                        name="description"
                        label="Descrição"
                        multiline
                        id="outlined-textarea"
                        rows={4}
                        value={editValues ? editValues.description : ''}
                        type="text"
                        variant="outlined"
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={modify} color="primary">
                        Salvar
          </Button>
                    <Button onClick={handleCloseEdit} color="primary">
                        Cancelar
          </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={deleteModalState} onClose={handleCloseDelete}>
                <DialogTitle id="form-dialog-title">Deletar {selectedCategory ? selectedCategory.name : ''}?</DialogTitle>
                <DialogActions>
                    <Button onClick={() => del(selectedCategory ? selectedCategory.id : 1)} color="primary">
                        Sim
          </Button>
                    <Button onClick={handleCloseDelete} color="primary">
                        Não
          </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={warningModalState} onClose={handleCloseWarning}>
                <DialogTitle id="form-dialog-title">Não é possível deletar "{selectedCategory ? selectedCategory.name : ''}"</DialogTitle>
                <DialogContent>Há produtos usando esta categoria!</DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseWarning} color="primary">
                        Ok
          </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}