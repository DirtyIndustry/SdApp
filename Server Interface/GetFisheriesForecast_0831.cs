[WebMethod(Description = "渔场预报(json)", EnableSession = true)]
public string GetFisheriesForecast_0831(String name, String areaflg)
{
    //count模块计数统计
    Count cc = new Count();
    cc.CountChoose(3, areaflg);
    List<string> ls = new List<string>();
    string result = "";
    string msg = "对不起，没有权限访问此接口";
    //验证是否有权访问
    if (!myheader.isValid(name, out msg))
    {
        ls.Add(msg);
        resutl = msg;
    }
    else
    {
        if (areaflg == BH || areaflg == SD)
        {
            //北海,//山东
            // ls = GetAllFisheriesForecast();
            result = GetAllFisheriesForecast_0831();
        }
    }
    return result;
    // return ls;
}
//渔场预报处理
private string GetAllFisheriesForecast_0831()
{
    List<string> ls = new List<string>();
    List<FisherieRawInfo> raw = new List<FisherieRawInfo>();
    List<FisherieInfo> result = new List<FisherieInfo>();
    try
    {
        //创建SqlConnection对象
        OracleConnection connection = new OracleConnection(System.Configuration.ConfigurationManager.AppSettings["OracleDbConnectionString"]);
        //打开数据库连接
        connection.Open();
        //创建SQL语句
        DateTime dtime = DateTime.Now;
        String sql = "select a.PUBLISHDATA,b.FISHINGGROUNDNAME,b.EFFECTIVETIME,b.INITIALVALUE,b.TRANSITIONALWORDS,b.C_INITIALVALUE,b.DIRECTION,b.C_DIRECTION from HT_YC_FILE a left join  HT_YC_WAVE b on a.ID=b.FILEID  where a.PUBLISHDATA=to_date('" + dtime.ToString("yyyy-MM-dd") + " 09','yyyy-mm-dd hh24') and b.FISHINGGROUNDNAME is not null and rownum<=33";
        String sql1 = "select a.PUBLISHDATA,b.FISHINGGROUNDNAME,b.EFFECTIVETIME,b.INITIALVALUE,b.TRANSITIONALWORDS,b.C_INITIALVALUE,b.DIRECTION,b.C_DIRECTION from HT_YC_FILE a left join  HT_YC_WAVE b on a.ID=b.FILEID  where a.PUBLISHDATA=to_date('" + dtime.AddDays(-1).ToString("yyyy-MM-dd") + " 09','yyyy-mm-dd hh24') and b.FISHINGGROUNDNAME is not null  and rownum<=33";
        //创建SqlCommand对象
        OracleCommand command = new OracleCommand(sql, connection);
        OracleDataReader reader = command.ExecuteReader();
        String s2 = "";
        String s3 = "";
        String s4 = "";
        String s5 = "";
        String s6 = "";
        String s7 = "";
        String s8 = "";
        //创建SqlCommand对象
        OracleCommand command1 = new OracleCommand(sql1, connection);
        OracleDataReader reader1 = command1.ExecuteReader();
        String s22 = "";
        String s33 = "";
        String s44 = "";
        String s55 = "";
        String s66 = "";
        String s77 = "";
        String s88 = "";
        if (reader.Read() == true)
        {
            do
            {
                String s1 = reader.GetDateTime(0).ToString();
                if (reader.GetValue(1).ToString().Equals(""))
                {
                    s2 = "";
                }
                else
                {
                    s2 = reader.GetValue(1).ToString();
                }
                if (reader.GetValue(2).ToString().Equals(""))
                {
                    s3 = "";
                }
                else
                {
                    s3 = reader.GetValue(2).ToString();
                }
                if (reader.GetValue(3).ToString().Equals(""))
                {
                    s4 = "";
                }
                else
                {
                    s4 = reader.GetValue(3).ToString();
                }

                if (reader.GetValue(4).ToString().Equals(""))
                {
                    s5 = "";
                }
                else
                {
                    s5 = reader.GetValue(4).ToString();
                }
                if (reader.GetValue(5).ToString().Equals(""))
                {
                    s6 = "";
                }
                else
                {
                    s6 = reader.GetValue(5).ToString();
                }
                if (reader.GetValue(6).ToString().Equals(""))
                {
                    s7 = "";
                }
                else
                {
                    s7 = reader.GetValue(6).ToString();
                    s7 = StrChange(s7);
                }
                if (reader.GetValue(7).ToString().Equals(""))
                {
                    s8 = "";
                }
                else
                {
                    s8 = reader.GetValue(7).ToString();
                    s8 = StrChange(s8);
                }
                string aaa = "";
                if (s7.Equals(""))
                {
                    aaa = "-";
                }
                else if (s8.Equals(""))
                {
                    aaa = s7;
                }
                else
                {
                    aaa = s7 + "转" + s8;
                }
                string data = s1 + "," + s2 + "," + s3 + "," + s4 + s5 + s6 + "," + aaa + "#";
                ls.Add(data);
                FisherieRawInfo info = new FisherieRawInfo();
                info.PUBLISHDATE = s1;
                info.FORECASTAREA = s2;
                info.EFFECTIVETIME = s3;
                info.WAVELVL = s4 + s5 + s6;
                info.WAVEDIR = aaa;
                raw.Add(info);
            }
            while (reader.Read() == true);
        }
        else if (reader1.Read() == true)
        {
            do
            {
                String s11 = reader1.GetDateTime(0).ToString();
                if (reader1.GetValue(1).ToString().Equals(""))
                {
                    s22 = "";
                }
                else
                {
                    s22 = reader1.GetValue(1).ToString();
                }
                if (reader1.GetValue(2).ToString().Equals(""))
                {
                    s33 = "";
                }
                else
                {
                    s33 = reader1.GetValue(2).ToString();
                }
                if (reader1.GetValue(3).ToString().Equals(""))
                {
                    s44 = "";
                }
                else
                {
                    s44 = reader1.GetValue(3).ToString();
                }
                if (reader1.GetValue(4).ToString().Equals(""))
                {
                    s55 = "";
                }
                else
                {
                    s55 = reader1.GetValue(4).ToString();
                }
                if (reader1.GetValue(5).ToString().Equals(""))
                {
                    s66 = "";
                }
                else
                {
                    s66 = reader1.GetValue(5).ToString();
                }
                if (reader1.GetValue(6).ToString().Equals(""))
                {
                    s77 = "";
                }
                else
                {
                    s77 = reader1.GetValue(6).ToString();
                    s77 = StrChange(s77);
                }
                if (reader1.GetValue(7).ToString().Equals(""))
                {
                    s88 = "";
                }
                else
                {
                    s88 = reader1.GetValue(7).ToString();
                    s88 = StrChange(s88);
                }
                string aaa = "";
                if (s77.Equals(""))
                {
                    aaa = "";
                }
                else if (s88.Equals(""))
                {
                    aaa = s77;
                }
                else
                {
                    aaa = s77 + "转" + s88;
                }
                string data = s11 + "," + s22 + "," + s33 + "," + s44 + s55 + s66 + "," + aaa + "#";
                ls.Add(data);
                FisherieRawInfo info = new FisherieRawInfo();
                info.PUBLISHDATE = s11;
                info.FORECASTAREA = s22;
                info.EFFECTIVETIME = s33;
                info.WAVELVL = s44 + s55 + s66;
                info.WAVEDIR = aaa;
                raw.Add(info);
            } while (reader1.Read() == true);
            connection.Close();
        }
    }
    catch (IOException ex)
    {
        Console.WriteLine(ex.ToString());
        Console.ReadLine();
        return null;
    }

    Dictionary<string, FisherieInfo> dic = new Dictionary<string, FisherieInfo>();
    foreach (FisherieRawInfo rawinfo in raw) {
        if (dic.ContainsKey(rawinfo.FORECASTAREA)) {
            if (rawinfo.EFFECTIVETIME == "0-24") {
                dic[rawinfo.FORECASTAREA].WAVELVL = rawinfo.WAVELVL;
                dic[rawinfo.FORECASTAREA].WAVEDIR = rawinfo.WAVEDIR;
            } else if (rawinfo.EFFECTIVETIME == "24-48") {
                dic[rawinfo.FORECASTAREA].WAVELVL48H = rawinfo.WAVELVL;
                dic[rawinfo.FORECASTAREA].WAVEDIR48H = rawinfo.WAVEDIR;
            } else if (rawinfo.EFFECTIVETIME == "48-72") {
                dic[rawinfo.FORECASTAREA].WAVELVL72H = rawinfo.WAVELVL;
                dic[rawinfo.FORECASTAREA].WAVEDIR72H = rawinfo.WAVEDIR;
            }
        } else {
            FisherieInfo newinfo = new FisherieInfo();
            newinfo.FORECASTAREA = rawinfo.FORECASTAREA;
            newinfo.PUBLISHDATE = rawinfo.PUBLISHDATE;
            if (rawinfo.EFFECTIVETIME == "0-24") {
                newinfo.WAVELVL = rawinfo.WAVELVL;
                newinfo.WAVEDIR = rawinfo.WAVEDIR;
            } else if (rawinfo.EFFECTIVETIME == "24-48") {
                newinfo.WAVELVL48H = rawinfo.WAVELVL;
                newinfo.WAVEDIR48H = rawinfo.WAVEDIR;
            } else if (rawinfo.EFFECTIVETIME == "48-72") {
                newinfo.WAVELVL72H = rawinfo.WAVELVL;
                newinfo.WAVEDIR72H = rawinfo.WAVEDIR;
            }
            dic.Add(rawinfo.FORECASTAREA, newinfo);
        }
    }

    foreach (KeyValuePair<string, FisherieInfo> item in dic) {
        result.Add(item.Value);
    }

    return JsonConvert.SerialiazeObject(result);
    // return ls;
}