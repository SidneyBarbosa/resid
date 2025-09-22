let actions = [
    { id: 1, name: 'Reunião com a comunidade do bairro Jardim', status: 'pendente', responsible: 'João', date: '2025-10-15' },
    { id: 2, name: 'Visita à escola municipal Criança Feliz', status: 'concluído', responsible: 'Maria', date: '2025-09-28' },
    { id: 3, name: 'Preparação de projeto de lei de saneamento', status: 'em andamento', responsible: 'Pedro', date: '2025-11-05' },
    { id: 4, name: 'Panfletagem na feira central', status: 'concluído', responsible: 'Ana', date: '2025-09-20' },
    { id: 5, name: 'Audiência pública sobre segurança', status: 'pendente', responsible: 'João', date: '2025-10-22' }
];

exports.getActions = (req, res) => {
    res.json(actions);
};

exports.createAction = (req, res) => {
    const newAction = req.body;
    newAction.id = Math.floor(Math.random() * 1000) + 6;
    newAction.status = "pendente";
    console.log('Nova ação recebida:', newAction);
    
    actions.push(newAction);
    
    res.status(201).json({ message: 'Ação criada com sucesso!', action: newAction });
};

exports.deleteAction = (req, res) => {
    const { id } = req.params;
    console.log(`Recebida requisição para excluir a ação com ID: ${id}`);
    
    actions = actions.filter(action => action.id != id);
    
    res.status(200).json({ message: 'Ação excluída com sucesso!', deletedId: id });
};

exports.updateAction = (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    
    const index = actions.findIndex(action => action.id == id);
    
    if (index !== -1) {
        actions[index] = { ...actions[index], ...updatedData };
        res.status(200).json({ message: 'Ação atualizada com sucesso!', action: actions[index] });
    } else {
        res.status(404).json({ message: 'Ação não encontrada.' });
    }
};