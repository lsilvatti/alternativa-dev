import React, { useEffect, useState } from 'react';
import { Button, Container, Divider, Fab, IconButton, InputAdornment, makeStyles, Typography } from '@material-ui/core';
import { Table, TableBody, TableCell, TableHead, TableRow, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@material-ui/core';
import { Delete, Edit, Add } from '@material-ui/icons';
import { getProduct, getCategory, postProduct, deleteProduct, putProduct } from '../services/api';
import { Product, Category } from "../services/interfaces"


export default function Produtos() {


    const defaultProduct: Product = {
        name: '',
        value: '0.00',
        categoryId: null,
        category: null,
        description: '',
    }

    useEffect(() => {
        populateProductList();
        populateCategoryList();
    }, [])

    const useStyles = makeStyles(theme => ({
        textField: {
            marginTop: 20,
            marginBottom: 20
        },
        mainContainer: {
            position: 'relative',
            top: 60,
            padding: 70,
            borderRadius: 16,
            backgroundColor: '#F5F5F5'
        },
        divider: {
            marginBottom: 30
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

    const [productList, setProductList] = useState<Product[]>([]);
    const [editModalState, setEditModalState] = useState(false);
    const [deleteModalState, setDeleteModalState] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product>();
    const [editValues, setEditValues] = useState<Product>();
    const [categoriesList, setCategories] = useState<Category[]>([]);

    const handleOpenEdit = (selected: number) => { setEditModalState(true); setSelectedProduct(productList[selected]); setEditValues(productList[selected]); }
    const handleCloseEdit = () => { setEditModalState(false) };

    const handleOpenDelete = (selected: number) => { setDeleteModalState(true); setSelectedProduct(productList[selected]); }
    const handleCloseDelete = () => { setDeleteModalState(false) }

    const handleOpenAdd = () => {
        setEditModalState(true);
        setSelectedProduct(undefined);
        defaultProduct.categoryId = categoriesList[0].id;
        setEditValues(defaultProduct);
    }

    function populateProductList() {
        getProduct().then(result => setProductList(result));
    }


    const changeEditFieldsHandle = (event: React.ChangeEvent<HTMLInputElement>) => {
        let newEditValues: any = { ...editValues };
        newEditValues[event.target.name] = event.target.value;
        if (event.target.name == "value"){
            newEditValues[event.target.name]
        }
        setEditValues(newEditValues);
        console.log(event.target.value);
        console.log(JSON.stringify(editValues));
    };


    function populateCategoryList() {
        getCategory().then((result) => { setCategories(result) })
    }

    function del(selected: number) {
        deleteProduct(selected).then(res => populateProductList());
        if (deleteModalState) {
            setDeleteModalState(false);
        }
    }

    function modifyProduct() {
        if (selectedProduct) {
            putProduct(editValues).then(res => populateProductList());
            setEditModalState(false);
        }
        else {

            postProduct(editValues).then(res => populateProductList());
            setEditModalState(false);
        }
    }



    return (
        <Container className={classes.mainContainer} maxWidth="xl">
                       <div className={classes.headerSection}> <Typography variant="h4" gutterBottom>Produtos</Typography>
            <Button
        variant="contained"
        color="primary"
        size="large"
        className={classes.button}
        startIcon={<Add />}
        onClick={() => handleOpenAdd()}
      >
       Adicionar Produto
      </Button></div>
            <Divider className={classes.divider} />
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell align="center">ID</TableCell>
                        <TableCell align="center">Nome</TableCell>
                        <TableCell align="center">Descrição</TableCell>
                        <TableCell align="center">Categoria</TableCell>
                        <TableCell align="center">Valor</TableCell>
                        <TableCell align="center">Ações</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {productList.map((row, index) => (
                        <TableRow key={row.id}>
                            <TableCell align="center">{row.id}</TableCell>
                            <TableCell align="center">{row.name}</TableCell>
                            <TableCell align="center">{row.description}</TableCell>
                            <TableCell align="center">{row.category.name}</TableCell>
                            <TableCell align="center">R${row.value}</TableCell>
                            <TableCell align="center">        
                            <IconButton color="primary" onClick={() => handleOpenEdit(index)} aria-label="Editar" component="span"><Edit /></IconButton>
                            <IconButton color="secondary" onClick={() => handleOpenDelete(index)} aria-label="Deletar" component="span"><Delete /></IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Dialog fullWidth maxWidth="sm" open={editModalState} onClose={handleCloseEdit}>
                <DialogTitle id="form-dialog-title">{selectedProduct ? `Editar ${selectedProduct.name}` : 'Adicionar um novo produto'}</DialogTitle>
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
                    <TextField
                        className={classes.textField}
                        fullWidth
                        InputProps={{
                            startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                        }}
                        onChange={changeEditFieldsHandle}
                        name="value"
                        label="Valor"
                        value={editValues ? editValues.value : ''}
                        type="number"
                        variant="outlined"
                    />
                    <TextField
                        className={classes.textField}
                        fullWidth
                        id="outlined-select-currency-native"
                        name="categoryId"
                        select
                        label="Categoria"
                        value={editValues ? editValues.categoryId : 1}
                        onChange={changeEditFieldsHandle}
                        SelectProps={{
                            native: true,
                        }}
                        variant="outlined"
                    >
                        {categoriesList.map((option) => (
                            <option key={option.id} value={option.id}>
                                {option.name}
                            </option>
                        ))}
                    </TextField>

                </DialogContent>

                <DialogActions>
                    <Button onClick={modifyProduct} color="primary">
                        Salvar
          </Button>
                    <Button onClick={handleCloseEdit} color="primary">
                        Cancelar
          </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={deleteModalState} onClose={handleCloseDelete}>
                <DialogTitle id="form-dialog-title">Deletar {selectedProduct ? selectedProduct.name : ''}?</DialogTitle>
                <DialogActions>
                    <Button onClick={() => del(selectedProduct ? selectedProduct.id : 1)} color="primary">
                        Sim
          </Button>
                    <Button onClick={handleCloseDelete} color="primary">
                        Não
          </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}