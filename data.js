(function () {
  "use strict";

  const commonSources = [
    { id: "constitution", title: "《中國共產黨章程》（2022）", publisher: "國家檔案局", date: "2022-11", url: "https://www.saac.gov.cn/daj/rsdrwfb/202211/9045ee7cc4dc4ee0a66322c8ae16563e.shtml", note: "制度地位與職權說明。" },
    { id: "regulation", title: "《中國共產黨中央委員會工作條例》", publisher: "共產黨員網", date: "2020-10-12", url: "https://www.12371.cn/2020/10/12/ARTI1602498113740862.shtml", note: "中央委員會與政治局工作內容說明。" }
  ];

  window.DEMO_DATA = {
    publishedAs: "公開試閱資料",
    reviewedAsOf: "2026-11-10",
    entries: [
      {
        id: "politburo",
        type: "中央領導機構",
        canonicalName: "中共中央政治局",
        officialName: "中國共產黨中央委員會政治局",
        aliases: ["中央政治局", "政治局", "中國共產黨中央政治局"],
        status: "待編輯查核",
        summary: "由中央委員會全體會議選舉產生的中央領導機構。",
        background: "中共中央政治局是中國共產黨的中央領導機構之一，由中央委員會全體會議選舉產生。依照中共黨章，中央政治局及其常務委員會在中央委員會全體會議閉會期間，行使中央委員會職權。研究政治局人事變化時，須區分各屆一中全會產生的原始當選名單與任期內調整後的特定日期現況，不宜將兩者混用。",
        definitionPlain: "中共中央政治局由中央委員會全體會議選舉產生。在中央委員會全體會議閉會期間，政治局及其常務委員會依黨章行使中央委員會職權。政治局委員、政治局常委與中央委員並非相同職位或身分。",
        definitionDetailed: "政治局討論、決定涉及黨和國家重大工作的問題；政治局常委會負責處理黨中央日常工作，中央書記處則是政治局及常委會的辦事機構。使用名單資料時，必須同時記錄屆次、快照日期及口徑，避免以後來的現況覆蓋原始當選名單。",
        timeline: [
          { date: "1924年11月", title: "首次設立政治局", detail: "中共中央曾設立政治局。", source: "history" },
          { date: "1927年", title: "中共五大正式設立", detail: "正式設立中央政治局及政治局常務委員會。", source: "history" },
          { date: "1938年後", title: "領導機構運作調整", detail: "六屆六中全會後，領導機構的運作安排逐步調整。", source: "history" },
          { date: "1945年", title: "中共七大採書記處制度", detail: "七大未選出政治局常委會，採中央書記處制度。", source: "history" },
          { date: "1956年", title: "中共八大恢復常委會", detail: "恢復設立中央政治局常務委員會。", source: "history" },
          { date: "2012年11月15日", title: "十八屆一中全會", detail: "原始選舉產生25名中央政治局委員。", source: "roster2012" },
          { date: "2022年10月23日", title: "二十屆一中全會", detail: "原始選舉產生24名中央政治局委員。", source: "roster2022" },
          { date: "2026年10月29日", title: "二十屆五中全會後", detail: "公開資料所示特定日期現況；此快照不等同2022年原始當選名單。", source: "roster2026" }
        ],
        rosters: [
          { id: "r2012", label: "第十八屆｜原始當選", date: "2012-11-15", basis: "一中全會原始當選名單", members: ["習近平", "馬凱", "王岐山", "王滬寧", "劉雲山", "劉延東", "劉奇葆", "許其亮", "孫春蘭", "孫政才", "李克強", "李建國", "李源潮", "汪洋", "張春賢", "張高麗", "張德江", "范長龍", "孟建柱", "趙樂際", "胡春華", "俞正聲", "栗戰書", "郭金龍", "韓正"] },
          { id: "r2022", label: "第二十屆｜原始當選", date: "2022-10-23", basis: "一中全會原始當選名單", members: ["丁薛祥", "習近平", "馬興瑞", "王毅", "王滬寧", "尹力", "石泰峰", "劉國中", "李希", "李強", "李干杰", "李書磊", "李鴻忠", "何衛東", "何立峰", "張又俠", "張國清", "陳文清", "陳吉寧", "陳敏爾", "趙樂際", "袁家軍", "黃坤明", "蔡奇"] },
          { id: "r2026", label: "第二十屆｜特定日期現況", date: "2026-10-29", basis: "指定日期公開名單快照", members: ["丁薛祥", "習近平", "王毅", "王滬寧", "尹力", "石泰峰", "劉國中", "李希", "李強", "李干杰", "李書磊", "李鴻忠", "何立峰", "張升民", "張國清", "陳文清", "陳吉寧", "陳敏爾", "趙樂際", "袁家軍", "黃坤明", "蔡奇"] }
        ],
        sources: [
          ...commonSources,
          { id: "history", title: "中央政治局沿革資料", publisher: "人民網黨建頻道", date: "2016-06-17", url: "https://dangjian.people.com.cn/GB/n1/2016/0617/c117092-28452607.html", note: "早期沿革節點。" },
          { id: "roster2012", title: "十八屆一中全會名單", publisher: "共產黨員網", date: "2012-11-15", url: "https://fuwu.12371.cn/2012/11/15/ARTI1352957959539617.shtml", note: "第十八屆原始當選名單。" },
          { id: "roster2022", title: "二十屆一中全會名單", publisher: "中華人民共和國教育部", date: "2022-10-23", url: "https://www.moe.gov.cn/jyb_xwfb/xw_zt/moe_357/jjyzt_2022/2022_zt17/yw/202210/t20221023_671623.html", note: "第二十屆原始當選名單。" },
          { id: "roster2026", title: "二十屆中央領導機構資料", publisher: "共產黨員網", date: "查核截至 2026-10-29", url: "https://www.12371.cn/special/20zyldjg/", note: "指定日期現況，並非原始當選名單。" }
        ]
      },
      {
        id: "central-committee",
        type: "中央領導機關",
        canonicalName: "中國共產黨中央委員會",
        officialName: "中國共產黨中央委員會",
        aliases: ["中共中央", "中央委員會", "中央委員"],
        status: "待編輯查核",
        summary: "由黨的全國代表大會選舉產生；在全國代表大會閉會期間執行其決議並領導黨的全部工作。",
        background: "中國共產黨中央委員會由黨的全國代表大會選舉產生。依黨章，在全國代表大會閉會期間，中央委員會執行全國代表大會的決議，領導黨的全部工作，並對外代表中國共產黨。",
        definitionPlain: "中央委員會是中共全國代表大會閉會期間的中央領導機關。中央委員是組成人員；中央委員會與中央政治局不是同一層級的名單。",
        definitionDetailed: null,
        timeline: [], rosters: [], sources: commonSources
      },
      {
        id: "standing-committee",
        type: "中央領導機構",
        canonicalName: "中共中央政治局常務委員會",
        officialName: "中國共產黨中央委員會政治局常務委員會",
        aliases: ["政治局常委會", "中央政治局常委會", "常委會", "政治局常委"],
        status: "待編輯查核",
        summary: "政治局常設機構；在中央委員會全體會議閉會期間，與政治局依黨章行使中央委員會職權。",
        background: "中共中央政治局常務委員會是中央政治局的常設機構。依黨章，中央政治局及其常務委員會在中央委員會全體會議閉會期間，行使中央委員會職權。",
        definitionPlain: "一般所稱「政治局常委會」是中央政治局的常設機構；「政治局常委」指其成員，與全體政治局委員並非同一名單。",
        definitionDetailed: null,
        timeline: [], rosters: [], sources: commonSources
      }
    ]
  };
})();
