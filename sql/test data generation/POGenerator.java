import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.Queue;
import java.io.BufferedReader;
import java.io.BufferedWriter;

public class POGenerator {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        BufferedWriter log = new BufferedWriter(new OutputStreamWriter(System.out));
        String line = br.readLine();

        int counter = 0;
        String name = "testdata";
        String area = "'Kent Ridge'";
        while (line != null) {
            String[] separate = line.split(" ");
            String email = "'" + separate[0] + "'";
            String pname = "'" + name + counter + "'";
            String phonenum = String.format("'%08d'", (long) (counter));
            String creditnum = String.format("'%04d %04d %04d %04d'", counter, counter, counter, counter);
            System.out.println(String.format("(%s, %s, %s, %s, %s), ", email, pname, phonenum, creditnum, area));
            counter += 9;
            line = br.readLine();
        }
    }
}