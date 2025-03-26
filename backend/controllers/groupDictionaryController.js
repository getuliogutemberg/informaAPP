const { GroupDictionary } = require("../models/DicionarioGrupo");

class GroupDictionaryController{
    async getGroupDictionaries(req, res) {
        try {
            const groupDictionary = (await GroupDictionary.find()).filter(dictionary => !dictionary.deletedAt);
            if (groupDictionary) {
                res.status(200).json(groupDictionary);
            } else {
                res.status(404).json({ message: "Grupo não encontrado" });
            }
          } catch (error) {
            res.status(500).json({ message: error.message });
          }
    };
}

export default new GroupDictionaryController();
