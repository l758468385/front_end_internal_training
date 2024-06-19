const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');

app.use(cors()); // 启用所有来源的 CORS
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

// Mock 数据，包含更多字段
const news = [
    {
        id: 1,
        title: "环球科技峰会在北京成功举办",
        cover: "https://example.com/news1_cover.jpg",
        summary: "本次峰会聚焦人工智能、区块链、云计算等前沿技术，吸引了全球顶尖科技公司和专家学者参与。",
        content: `
            <p style="text-align: justify;">近日，福建闽清法院审结一起返还原物纠纷案件。原告是一名当地养牛农户，每日在山里、田里放养牛群。2024年1月9日，其发现养殖的一只黑色小黄牛丢失，三日后，在被告院子中发现一只黑色黄牛。</p><p style="text-align: justify;">因原告曾在黑色黄牛耳朵处做标记，其认为被告院子中的黑色黄牛就是自己丢失的那只，于是找到被告据理力争，要求返还。</p><p style="text-align: justify;">但双方均笃定该黑色黄牛系自家所养，争执不下后，原告遂向闽清法院白樟法庭提起诉讼。</p><p style="text-align: justify;">案件受理后，原告随即申请为小牛进行亲子鉴定。</p><p style="text-align: justify;">“鉴定费1万元，费用不低。若亲子鉴定结果显示小牛与原告家的牛具有亲子关系，被告不仅要返还黑色黄牛，还需要支付鉴定费用、诉讼费等费用；若亲子鉴定结果显示不具有亲子关系，原告要承担鉴定费用。”承办法官向双方分析法律后果后，双方均坚持进行亲子鉴定，原告先行支付鉴定费用1万元。</p><p style="text-align: justify;">为确保鉴定结果公平公正，承办法官组织司法所工作人员、双方当事人随同鉴定人员一同前往现场见证采样。鉴定人员对原告的母牛、案件争议的黑色黄牛分别提取了血液、毛发以及口腔黏膜作为备用样本，并由在场人员签字确认。<img src="https://p3-sign.toutiaoimg.com/tos-cn-i-axegupay5k/50092bd417e84800bb780c87ddfdb105~noop.image?_iz=58558&amp;from=article.pc_detail&amp;lk3s=953192f4&amp;x-expires=1719417954&amp;x-signature=5Z7ObPrbCATvUxlKfFKdlTu%2FI6k%3D" alt="" data-href="" style="height: auto;"></p><p style="text-align: justify;">工作人员为小牛采样。图/闽清法院</p><p style="text-align: justify;">一周后，司法鉴定结果显示，排除黑色黄牛（公牛）和原告家母牛之间的生物学亲子关系。原告无可辩驳，最终申请撤诉。</p><p style="text-align: justify;">九派新闻记者 杨冰钰</p><p style="text-align: justify;">编辑 刘萌 肖洁</p><p style="text-align: justify;">【爆料】请联系记者微信：linghaojizhe</p><p style="text-align: justify;">【来源：九派新闻】</p><p style="text-align: justify;">声明：此文版权归原作者所有，若有来源错误或者侵犯您的合法权益，您可通过邮箱与我们取得联系，我们将及时进行处理。邮箱地址：jpbl@jp.jiupainews.com</p><p><br></p>
        `
    },
    {
        id: 2,
        title: "科学家发现新型太阳系外行星",
        cover: "https://example.com/news2_cover.jpg",
        summary: "国际天文学家团队通过尖端望远镜观测，发现距离地球约10光年的太阳系外一颗新行星，引发了广泛关注。",
        content: `
            <p>国际天文学家团队最近在距离地球约10光年的地方发现了一颗新型太阳系外行星，这一发现被认为是对目前天文学界的重大突破。</p>
            <p>据报道，这颗行星被命名为“新发现-1”，其所处的星球系具有与地球相似的星球生命适宜区，科学家们认为这可能是未来人类探索宇宙生命的重要目标。</p>
            <p>新发现-1行星的直径约为地球的2倍，且具有大气层，天文学家通过望远镜观测到了其表面的明显特征，包括可能存在的大规模水域。</p>
        `
    },
    {
        id: 3,
        title: "特斯拉推出全新电动飞机概念",
        cover: "https://example.com/news3_cover.jpg",
        summary: "特斯拉首席执行官马斯克宣布公司将开发全新的电动飞机，计划将飞行技术与清洁能源相结合。",
        content: `
            <p>特斯拉公司最新推出了一项激动人心的计划，即开发全新的电动飞机概念。该飞机将采用先进的电动引擎技术，旨在实现零排放、低噪音的飞行体验。</p>
            <p>马斯克首席执行官表示，这一项目的目标是在未来几年内推出全新的电动飞机原型，并逐步完善其飞行性能和能效。他还强调，电动飞机的推出将为全球航空业带来革命性的改变。</p>
            <p>新型电动飞机预计将配备先进的自动驾驶系统和航空电子设备，以确保飞行安全和舒适性。特斯拉公司表示，将与全球航空制造商和技术公司合作，加速该项目的进展。</p>
        `
    },
    {
        id: 4,
        title: "2024年夏季奥运会在巴黎盛大开幕",
        cover: "https://example.com/news4_cover.jpg",
        summary: "2024年夏季奥运会在法国巴黎市举行，为期17天的盛会吸引了全球近200个国家和地区的顶尖运动员参与。",
        content: `
            <p>2024年夏季奥林匹克运动会日前在法国巴黎市正式开幕，为期17天的体育盛会将汇聚全球近200个国家和地区的顶尖运动员和观众。</p>
            <p>本届奥运会设有多个新的竞技项目和体育项目，包括街头篮球、攀岩和电子竞技等，吸引了年轻一代运动员的广泛关注和参与。</p>
            <p>开幕式上，法国政府和国际奥委会宣布，本届奥运会将致力于推动体育运动的多样化发展和全球和平理念的传播，为全球社会注入新的活力和希望。</p>
        `
    },
    {
        id: 5,
        title: "科学家发现月球隐藏深处巨大冰层",
        cover: "https://example.com/news5_cover.jpg",
        summary: "美国航天局最新发现，月球表面下隐藏着巨大规模的冰层，这一发现有望为未来月球探索提供重要资源支持。",
        content: `
            <p>美国航天局最新宣布，通过最新一代月球探测器的数据分析，发现月球表面下藏匿着巨大规模的冰层。这一发现被认为是未来月球探索的重大突破。</p>
            <p>月球隐藏深处的冰层被发现位于南极和北极的深度地下，其规模之大远超过科学家们此前的预期，为未来探索月球和长期停留提供了重要的水资源。</p>
            <p>美国航天局和国际科学界表示，这一发现将极大促进未来月球任务的实施和深空探索的进展，有望推动人类对宇宙和地球自然资源的更深入理解。</p>
        `
    }
];

// 分页获取新闻列表，返回标题、封面、概述和内容
app.get('/news', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const total = news.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const data = news.slice(start, end).map(item => ({
        title: item.title,
        cover: item.cover,
        summary: item.summary,
        content: item.content,
        id:item.id
    }));

    res.json({
        code: 200,
        data,
        links: {
            self: `/news?page=${page}&pageSize=${pageSize}`,
            next: page * pageSize < total ? `/news?page=${page + 1}&pageSize=${pageSize}` : null,
            prev: page > 1 ? `/news?page=${page - 1}&pageSize=${pageSize}` : null
        },
        total,
        current: page,
        pageSize
    });
});

// 获取新闻详情，返回标题、封面和内容
app.get('/news/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const newsItem = news.find(item => item.id === id);

    if (newsItem) {
        res.json({
            code: 200,
            data: {
                title: newsItem.title,
                cover: newsItem.cover,
                content: newsItem.content
            }
        });
    } else {
        res.json({
            code: 404,
            message: '新闻未找到'
        });
    }
});

// 获取首页热门新闻，返回标题和封面
app.get('/news/hot', (req, res) => {
    const hotNews = news.slice(0, 5).map(item => ({
        title: item.title,
        cover: item.cover
    }));

    res.json({
        code: 200,
        data: hotNews
    });
});

app.listen(port, () => {
    console.log(`服务器正在运行在 http://localhost:${port}`);
});
