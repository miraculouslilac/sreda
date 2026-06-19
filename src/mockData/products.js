export const categoryLabels = {
  protein: 'Белок',
  vegetables: 'Овощи и зелень',
  grains: 'Крупы / сложные углеводы',
  dairy: 'Молочные / альтернативы',
  snacks: 'Перекусы',
  ready: 'Готовые решения',
};

export const products = [
  { id: 'p1', name: 'Филе индейки охлаждённое', price: 459, weight: '500 г', category: 'protein', kcal: 114, protein: 24, fat: 2, carbs: 0, rating: 4.8, tags: ['белок', 'без сахара'], composition: 'Филе индейки охлаждённое. Без добавок.', reason: 'Выбрала индейку — это лёгкий белок с минимумом жира, подходит под вашу цель.', image: 'linear-gradient(135deg, #FFE4C4 0%, #FFDAB9 100%)' },
  { id: 'p2', name: 'Куриная грудка на пару', price: 389, weight: '400 г', category: 'protein', kcal: 137, protein: 29, fat: 2, carbs: 0, rating: 4.7, tags: ['белок', 'быстро'], composition: 'Куриная грудка, вода, соль.', reason: 'Готовая грудка — быстрый белок без готовки, идеально для занятых дней.', image: 'linear-gradient(135deg, #FFF0DB 0%, #FFE4B5 100%)' },
  { id: 'p3', name: 'Яйца С1 фермерские', price: 149, weight: '10 шт', category: 'protein', kcal: 155, protein: 13, fat: 11, carbs: 1, rating: 4.9, tags: ['белок', 'базовый'], composition: 'Яйца куриные фермерские.', reason: 'Яйца — универсальный источник белка для завтраков и перекусов.', image: 'linear-gradient(135deg, #FFFACD 0%, #FFF8DC 100%)' },
  { id: 'p4', name: 'Брокколи свежая', price: 189, weight: '400 г', category: 'vegetables', kcal: 34, protein: 3, fat: 0, carbs: 7, rating: 4.6, tags: ['клетчатка', 'витамины'], composition: 'Брокколи свежая.', reason: 'Брокколи — отличный источник клетчатки и витамина C.', image: 'linear-gradient(135deg, #90EE90 0%, #98FB98 100%)' },
  { id: 'p5', name: 'Шпинат свежий', price: 129, weight: '125 г', category: 'vegetables', kcal: 23, protein: 3, fat: 0, carbs: 4, rating: 4.5, tags: ['железо', 'клетчатка'], composition: 'Шпинат свежий мытый.', reason: 'Шпинат богат железом и подходит для салатов и омлетов.', image: 'linear-gradient(135deg, #228B22 0%, #32CD32 100%)' },
  { id: 'p6', name: 'Помидоры черри', price: 169, weight: '250 г', category: 'vegetables', kcal: 18, protein: 1, fat: 0, carbs: 4, rating: 4.7, tags: ['антиоксиданты', 'быстро'], composition: 'Помидоры черри свежие.', reason: 'Черри — быстрый перекус и добавка к любому блюду.', image: 'linear-gradient(135deg, #FF6347 0%, #FF4500 100%)' },
  { id: 'p7', name: 'Авокадо', price: 149, weight: '1 шт', category: 'vegetables', kcal: 160, protein: 2, fat: 15, carbs: 9, rating: 4.8, tags: ['полезные жиры', 'энергия'], composition: 'Авокадо Хасс.', reason: 'Авокадо — полезные жиры для стабильной энергии.', image: 'linear-gradient(135deg, #556B2F 0%, #6B8E23 100%)' },
  { id: 'p8', name: 'Гречка зелёная', price: 179, weight: '500 г', category: 'grains', kcal: 310, protein: 12, fat: 3, carbs: 62, rating: 4.6, tags: ['сложные углеводы', 'клетчатка'], composition: 'Гречка зелёная необжаренная.', reason: 'Зелёная гречка — медленные углеводы без скачков сахара.', image: 'linear-gradient(135deg, #DEB887 0%, #D2B48C 100%)' },
  { id: 'p9', name: 'Булгур', price: 139, weight: '500 г', category: 'grains', kcal: 342, protein: 12, fat: 1, carbs: 76, rating: 4.5, tags: ['сложные углеводы', 'клетчатка'], composition: 'Булгур из твёрдых сортов пшеницы.', reason: 'Булгур — отличная альтернатива рису с высоким содержанием клетчатки.', image: 'linear-gradient(135deg, #F5DEB3 0%, #FFE4B5 100%)' },
  { id: 'p10', name: 'Киноа белая', price: 299, weight: '300 г', category: 'grains', kcal: 368, protein: 14, fat: 6, carbs: 64, rating: 4.7, tags: ['белок', 'сложные углеводы'], composition: 'Киноа белая.', reason: 'Киноа — растительный белок + сложные углеводы в одном продукте.', image: 'linear-gradient(135deg, #FFFACD 0%, #FAFAD2 100%)' },
  { id: 'p11', name: 'Йогурт греческий 2%', price: 89, weight: '200 г', category: 'dairy', kcal: 66, protein: 10, fat: 2, carbs: 4, rating: 4.8, tags: ['белок', 'без сахара'], composition: 'Молоко нормализованное, закваска.', reason: 'Выбрала этот йогурт, потому что в нём больше белка и меньше сахара, чем в похожих вариантах.', image: 'linear-gradient(135deg, #F0F8FF 0%, #E6E6FA 100%)' },
  { id: 'p12', name: 'Творог 5% зернёный', price: 109, weight: '300 г', category: 'dairy', kcal: 110, protein: 16, fat: 5, carbs: 3, rating: 4.7, tags: ['белок', 'кальций'], composition: 'Молоко, закваска, соль.', reason: 'Зернёный творог — белок + кальций, идеален для завтрака.', image: 'linear-gradient(135deg, #FFFFF0 0%, #FFF8DC 100%)' },
  { id: 'p13', name: 'Кефир 1%', price: 79, weight: '500 мл', category: 'dairy', kcal: 40, protein: 3, fat: 1, carbs: 4, rating: 4.6, tags: ['пробиотики', 'лёгкий'], composition: 'Молоко нормализованное, кефирная закваска.', reason: 'Кефир поддерживает пищеварение и подходит как лёгкий перекус.', image: 'linear-gradient(135deg, #F5F5F5 0%, #DCDCDC 100%)' },
  { id: 'p14', name: 'Хумус классический', price: 169, weight: '200 г', category: 'snacks', kcal: 166, protein: 8, fat: 10, carbs: 14, rating: 4.7, tags: ['белок', 'клетчатка'], composition: 'Нут, тахини, оливковое масло, лимонный сок, чеснок, соль.', reason: 'Хумус — сытный перекус с растительным белком и клетчаткой.', image: 'linear-gradient(135deg, #F5DEB3 0%, #FAEBD7 100%)' },
  { id: 'p15', name: 'Орехи микс (миндаль, кешью)', price: 299, weight: '150 г', category: 'snacks', kcal: 607, protein: 20, fat: 52, carbs: 20, rating: 4.8, tags: ['энергия', 'полезные жиры'], composition: 'Миндаль, кешью.', reason: 'Орехи — быстрая энергия и полезные жиры для перекуса.', image: 'linear-gradient(135deg, #DEB887 0%, #D2691E 100%)' },
  { id: 'p16', name: 'Батончик протеиновый без сахара', price: 119, weight: '50 г', category: 'snacks', kcal: 180, protein: 15, fat: 8, carbs: 12, rating: 4.5, tags: ['белок', 'без сахара', 'быстро'], composition: 'Изолят сывороточного белка, какао-масло, эритрит, миндаль.', reason: 'Протеиновый батончик без сахара — удобный перекус с высоким белком.', image: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)' },
  { id: 'p17', name: 'Боул с киноа и овощами', price: 349, weight: '300 г', category: 'ready', kcal: 280, protein: 12, fat: 10, carbs: 35, rating: 4.6, tags: ['сбалансированный', 'быстро'], composition: 'Киноа, брокколи, морковь, нут, соус тахини.', reason: 'Готовый боул — сбалансированный обед без готовки.', image: 'linear-gradient(135deg, #98FB98 0%, #90EE90 100%)' },
  { id: 'p18', name: 'Суп-крем из тыквы', price: 249, weight: '400 мл', category: 'ready', kcal: 95, protein: 3, fat: 4, carbs: 12, rating: 4.5, tags: ['лёгкий', 'быстро', 'клетчатка'], composition: 'Тыква, сливки, лук, мускатный орех, соль.', reason: 'Лёгкий суп — тёплый ужин с минимумом калорий.', image: 'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)' },
];

export const cheaperAlternatives = [
  { id: 'alt1', name: 'Филе курицы охлаждённое', price: 289, weight: '500 г', kcal: 110, protein: 23, fat: 1, carbs: 0, rating: 4.5, tags: ['белок', 'выгодно'], image: 'linear-gradient(135deg, #FFE4C4 0%, #FFDAB9 100%)' },
  { id: 'alt2', name: 'Йогурт натуральный 1.5%', price: 59, weight: '200 г', kcal: 57, protein: 8, fat: 1.5, carbs: 5, rating: 4.4, tags: ['белок', 'выгодно'], image: 'linear-gradient(135deg, #F0F8FF 0%, #E6E6FA 100%)' },
  { id: 'alt3', name: 'Творог обезжиренный', price: 79, weight: '300 г', kcal: 85, protein: 18, fat: 0.5, carbs: 3, rating: 4.3, tags: ['белок', 'выгодно'], image: 'linear-gradient(135deg, #FFFFF0 0%, #FFF8DC 100%)' },
];

export const proteinAlternatives = [
  { id: 'alt4', name: 'Тунец в собственном соку', price: 189, weight: '185 г', kcal: 96, protein: 22, fat: 1, carbs: 0, rating: 4.6, tags: ['белок', 'омега-3'], image: 'linear-gradient(135deg, #B0E0E6 0%, #87CEEB 100%)' },
  { id: 'alt5', name: 'Сыр Рикотта', price: 199, weight: '250 г', kcal: 174, protein: 11, fat: 13, carbs: 3, rating: 4.5, tags: ['белок', 'кальций'], image: 'linear-gradient(135deg, #FFFFF0 0%, #FFFACD 100%)' },
  { id: 'alt6', name: 'Фасоль красная', price: 99, weight: '400 г', kcal: 127, protein: 8, fat: 0, carbs: 22, rating: 4.4, tags: ['белок', 'клетчатка'], image: 'linear-gradient(135deg, #CD5C5C 0%, #B22222 100%)' },
];
