const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

const livros = [
    { id: 1, titulo: 'O Senhor dos Anéis', autor: 'J.R.R. Tolkien', ano: 1954 },
    { id: 2, titulo: 'Harry Potter e a Pedra Filosofal', autor: 'J.K. Rowling', ano: 1997 },
    { id: 3, titulo: '1984', autor: 'George Orwell', ano: 1949 },
    { id: 4, titulo: 'Dom Quixote', autor: 'Miguel de Cervantes', ano: 1605 },
    { id: 5, titulo: 'Cem Anos de Solidão', autor: 'Gabriel García Márquez', ano: 1967 },
    { id: 6, titulo: 'O Pequeno Príncipe', autor: 'Antoine de Saint-Exupéry', ano: 1943 },
    { id: 7, titulo: 'A Menina que Roubava Livros', autor: 'Markus Zusak', ano: 2005 },
    { id: 8, titulo: 'A Revolução dos Bichos', autor: 'George Orwell', ano: 1945 },
    { id: 9, titulo: 'O Hobbit', autor: 'J.R.R. Tolkien', ano: 1937 },
    { id: 10, titulo: 'Moby Dick', autor: 'Herman Melville', ano: 1851 }
];

app.get('/', (req, res) => {
    res.render('index', { livros });
});

app.get('/buscar', (req, res) => {
    const tipoBusca = req.query.tipo;
    let termoBusca = req.query.termo.toLowerCase();
    
    // Removendo acentos do termo de busca
    termoBusca = termoBusca.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    let resultados = [];

    if (tipoBusca === 'titulo') {
        resultados = livros.filter(livro => {
            const tituloSemAcento = livro.titulo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            return tituloSemAcento.includes(termoBusca);
        });
    } else if (tipoBusca === 'ano') {
        const anoBusca = parseInt(termoBusca);
        resultados = livros.filter(livro => livro.ano === anoBusca);
    }

    if (resultados.length === 0) {
        return res.render('index', { livros, mensagemErro: 'Livro não encontrado.' });
    }

    res.render('index', { livros, resultados, mensagemErro: null }); // Certifique-se de passar a variável mensagemErro
});

app.get('/buscar/:ano', (req, res) => {
    const anoBusca = parseInt(req.params.ano);
    
    // Verifica se o ano fornecido é um número
    if (isNaN(anoBusca)) {
        return res.render('index', { livros, mensagemErro: 'Ano de busca inválido.' });
    }

    // Filtra os livros pelo ano
    const resultados = livros.filter(livro => livro.ano === anoBusca);
    
    if (resultados.length === 0) {
        return res.render('index', { livros, mensagemErro: 'Nenhum livro encontrado para o ano especificado.' });
    }

    res.render('index', { livros, resultados });
});


app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
