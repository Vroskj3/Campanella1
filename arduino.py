import sqlite3
import time
from multiprocessing import Process
import datetime
import serial.tools.list_ports
import serial

conn = sqlite3.connect("bellDatabase.db")
c = conn.cursor()
totalWeekDays = [
    "domenica",
    "lunedi",
    "martedi",
    "mercoledi",
    "giovedi",
    "venerdi",
    "sabato",
]

porta_arduino = ""
porta_seriale = ""
ports = list(serial.tools.list_ports.comports())
for p in ports:
    porta_arduino = p
    porta_seriale = p.device
arduino = serial.Serial(str(porta_seriale), 9600, writeTimeout=0.1)


def ringNowRead():
    while (True):
        ringNow = conn.cursor().execute("SELECT * FROM ringNow").fetchall()
        if (ringNow != []):
            arduino.write(str(ringNow[0][0]).encode())
            c.executescript('DELETE FROM ringNow')
        time.sleep(1)


def ringScheduleRead():
    suonato = False
    suonatoquale = []
    while (True):
        c.execute('SELECT * FROM ringSchedule')
        data = c.fetchall()
        if (data != []):
            for row in data:
                id = row[0]
                fromDate = row[1]
                toDate = row[2]
                weekDays = row[3].split(",")
                weekDays = list(filter(None, weekDays))
                ringTimes = row[4].split(",")
                ringTimes = list(filter(None, ringTimes))
                fromDate = fromDate.split("-")
                fromDate = datetime.datetime(
                    int(fromDate[0]), int(fromDate[1]), int(fromDate[2]))
                toDate = toDate.split("-")
                toDate = datetime.datetime(
                    int(toDate[0]), int(toDate[1]), int(toDate[2]))
                if (datetime.datetime.today() >= fromDate and datetime.datetime.today() <= toDate):
                    if (totalWeekDays[int(
                            datetime.datetime.today().strftime("%w"))] in weekDays):
                        for x in ringTimes:
                            l = x.split(":")
                            k = datetime.datetime.now()
                            f = k.replace(
                                hour=int(l[0]), minute=int(l[1]))
                            if (k == f):
                                if (not suonato):
                                    suonato = True
                                    suonatoquale = l
                                    arduino.write("1".encode())
                            elif (suonatoquale == l):
                                suonato = False
        time.sleep(1)


def loginCodeRead():
    codeWrote = False
    while (True):
        loginCode = conn.cursor().execute("SELECT * FROM loginCode").fetchall()
        if (loginCode != [] and not codeWrote):
            arduino.write("4".encode())
            time.sleep(1)
            codeWrote = True
            arduino.write(str(loginCode[0][0]).encode())
        elif (codeWrote and loginCode == []):
            arduino.write("5".encode())
            codeWrote = False
        time.sleep(1)


if __name__ == "__main__":
    p1 = Process(target=ringNowRead)
    p1.start()
    p2 = Process(target=ringScheduleRead)
    p2.start()
    p3 = Process(target=loginCodeRead)
    p3.start()
    p1.join()
    p2.join()
    p3.join()
